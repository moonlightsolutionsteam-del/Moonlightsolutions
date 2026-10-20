// Wedding reminders: runs every 5 minutes (pg_cron) and sends phone/browser notifications to the Wedding Panel logins.
//  - Reminders people add in the panel, at their time (daily ones every day)
//  - Wedding-day cues, a few minutes before each one (shifted by "running late")
//  - A 9 AM digest for each login: to-dos and vendor payments due, messages to send, approvals waiting
// It also answers {mode:"test", key} from the panel with a test notification to that login's devices.
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
import webpush from "npm:web-push@3.6.7";

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "content-type, apikey, authorization, x-cron-secret", "Access-Control-Allow-Methods": "POST, OPTIONS" };
const json = (o: unknown, status = 200) => new Response(JSON.stringify(o), { status, headers: { ...CORS, "Content-Type": "application/json" } });

// India time helpers (the wedding runs on IST, UTC+5:30)
const IST = 330 * 60000;
const istDate = (ms: number) => new Date(ms + IST).toISOString().slice(0, 10);
const istHour = (ms: number) => new Date(ms + IST).getUTCHours();
const at = (date: string, hm: string) => Date.parse(date + "T" + hm + ":00+05:30");
const mins = (t: string) => { const m = String(t || "").match(/(\d+):(\d+)\s*(AM|PM)/i); return m ? (+m[1] % 12) * 60 + +m[2] + (/pm/i.test(m[3]) ? 720 : 0) : null; };
const hm = (n: number) => String(Math.floor(n / 60)).padStart(2, "0") + ":" + String(n % 60).padStart(2, "0");
const DAYS: Record<string, string> = { "1": "2027-01-20", "2": "2027-01-21" };
const fmt = (d: string) => new Date(d + "T00:00:00+05:30").toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" });

// The panel's dated message plan (Announce tab), so the 9 AM digest can say what to send today
const PLAN = [["2026-10-25", "", "Save the date"], ["2026-11-08", "", "The invitation"], ["2026-11-08", "", "WhatsApp status / story"], ["2026-11-22", "", "What to wear"],
  ["2026-12-05", "", "RSVP reminder"], ["2026-12-14", "", "Last day to RSVP"], ["2027-01-03", "", "Your room for Wednesday night"], ["2027-01-04", "", "Vendor entry passes"],
  ["2027-01-13", "", "One week to go"], ["2027-01-19", "", "See you tomorrow"], ["2027-01-22", "", "Thank you"], ["2027-02-14", "", "Photos are ready"]];

type User = { id: string; name: string; fam: string; owner: boolean };
const side = (u: User) => (/^b/i.test(u.fam) ? "bride" : "groom");
// Who a reminder or cue is for: everyone, the admin, one family (the admin sees both), or one person
const forUser = (aud: string, u: User, uid?: string | null) =>
  aud === "all" || aud === "both" || (aud === "me" ? uid === u.id : u.owner || (aud === "groom" && side(u) === "groom") || (aud === "bride" && side(u) === "bride"));
// A to-do or vendor "owner" (Both, Groom's family, Bride's family, Coordinators...) mapped to a login
const ownerFor = (owner: string, u: User) => u.owner || !/groom|bride/i.test(owner || "") || (/bride/i.test(owner) ? side(u) === "bride" : side(u) === "groom");

async function claim(key: string) { // true only the first time a key is seen, so nothing is sent twice
  const { error } = await db.from("notif_log").insert({ key });
  return !error;
}

async function send(subs: any[], payload: Record<string, unknown>, ttl = 3600) {
  let ok = 0;
  for (const s of subs) {
    try { await webpush.sendNotification(s.sub, JSON.stringify(payload), { TTL: ttl, urgency: "high" }); ok++; await db.from("push_subs").update({ last_ok: new Date().toISOString() }).eq("id", s.id); }
    catch (e: any) { if (e?.statusCode === 404 || e?.statusCode === 410) await db.from("push_subs").delete().eq("id", s.id); }
  }
  return ok;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });
  const cfg = (await db.rpc("_notify_config")).data as any;
  if (!cfg) return json({ error: "not configured" }, 500);
  webpush.setVapidDetails(cfg.subject, cfg.vapid_public, cfg.vapid_private);
  const body = await req.json().catch(() => ({}));

  const { data: users } = await db.from("admin_users").select("id,name,fam,owner,active");
  const { data: subRows } = await db.from("push_subs").select("id,uid,sub");
  const subsOf = (uid: string) => (subRows || []).filter((s) => s.uid === uid);

  // Test from the panel: the passphrase decides whose devices get it
  if (body.mode === "test") {
    const me = (await db.rpc("admin_whoami", { p_key: String(body.key || "") })).data as any;
    if (!me) return json({ error: "forbidden" }, 403);
    const n = await send(subsOf(me.id), { title: "Wedding Panel ✓", body: "Notifications are working on this device, " + String(me.name).split(" ")[0] + ".", url: "admin.html#remind", tag: "test" }, 600);
    return json({ sent: n, devices: subsOf(me.id).length });
  }
  if (req.headers.get("x-cron-secret") !== cfg.cron) return json({ error: "forbidden" }, 403);

  const now = Date.now(), today = istDate(now), people = (users || []).filter((u: any) => u.active !== false) as User[];
  const withDevices = people.filter((u) => subsOf(u.id).length);
  let sent = 0;
  const toAll = async (who: User[], key: string, payload: Record<string, unknown>, ttl?: number) => {
    if (!who.length || !(await claim(key))) return;
    for (const u of who) sent += await send(subsOf(u.id), payload, ttl);
  };

  // 1. Reminders people set in the panel
  const { data: rems } = await db.from("reminders").select("*").eq("removed", false).eq("done", false);
  for (const r of rems || []) {
    let occ = Date.parse(r.at);
    if (r.repeat === "daily" && now >= occ) { const t = new Date(occ + IST).toISOString().slice(11, 16); occ = at(today, t); if (occ > now) occ -= 864e5; }
    if (now < occ || now - occ > 6 * 3600e3) continue;
    const who = withDevices.filter((u) => forUser(r.aud, u, r.uid));
    await toAll(who, "rem:" + r.id + ":" + occ, { title: "⏰ " + r.title, body: (r.note || "") + (r.by_name ? (r.note ? "\n" : "") + "Set by " + r.by_name : ""), url: "admin.html#remind", tag: "rem-" + r.id });
  }

  // 2. Wedding-day cues, "lead" minutes before each, shifted by any "running late" delay
  const [{ data: cues }, { data: cst }, { data: st }] = await Promise.all([
    db.from("plan_items").select("id,data").eq("kind", "cue").eq("removed", false),
    db.from("cue_status").select("cue_id,done"), db.from("settings").select("key,value").in("key", ["delay"])]);
  const doneSet = new Set((cst || []).filter((c) => c.done).map((c) => c.cue_id));
  const delay = (st || []).find((s) => s.key === "delay")?.value || {};
  for (const c of cues || []) {
    const d = c.data || {}, date = DAYS[String(d.day || 1)], m = mins(d.time);
    if (!date || m == null || doneSet.has(c.id)) continue;
    const late = delay.day === date ? +delay.minutes || 0 : 0, eff = at(date, hm(m)) + late * 60000, lead = d.lead == null ? 10 : +d.lead, fire = eff - lead * 60000;
    if (now < fire || now > eff + 15 * 60000) continue;
    const t = new Date(eff + IST).toISOString().slice(11, 16), h = +t.slice(0, 2), shown = (h % 12 || 12) + ":" + t.slice(3) + (h < 12 ? " AM" : " PM");
    const who = withDevices.filter((u) => forUser(d.who || "all", u, null));
    await toAll(who, "cue:" + c.id + ":" + eff, { title: (lead ? "In " + lead + " min · " : "Now · ") + shown + ": " + d.title, body: [d.place, d.note, late ? "Running " + late + " min late" : ""].filter(Boolean).join(" · "), url: "admin.html#remind", tag: "cue-" + c.id }, 1800);
  }

  // 3. 9 AM digest for each login with a device, until the wedding is over
  if (istHour(now) === 9 && today <= "2027-01-22") {
    const [{ data: plan }, { data: pend }] = await Promise.all([db.from("plan_items").select("kind,data").in("kind", ["task", "vendor", "game"]).eq("removed", false), db.from("pending").select("id").eq("status", "pending")]);
    const soon = (d: string, ahead: number) => d && d <= istDate(now + ahead * 864e5);
    for (const u of withDevices) {
      const lines: string[] = [];
      for (const t of (plan || []).filter((x) => x.kind === "task" && !x.data.done && soon(x.data.due, 2) && ownerFor(x.data.owner, u)).sort((a, b) => String(a.data.due).localeCompare(b.data.due)))
        lines.push((t.data.due < today ? "Overdue: " : t.data.due === today ? "Today: " : fmt(t.data.due) + ": ") + t.data.title);
      for (const v of (plan || []).filter((x) => x.kind === "vendor" && !/Paid in full/.test(x.data.status || "") && ownerFor(x.data.owner, u)))
        for (const [k, w] of [["adv_due", "advance"], ["bal_due", "balance"]]) { const d = v.data[k]; if (d && soon(d, 3) && d >= istDate(now - 30 * 864e5) && !(k === "adv_due" && /Advance|Paid/.test(v.data.status || ""))) lines.push((d < today ? "Overdue: " : "Pay by " + fmt(d) + ": ") + (v.data.name || v.data.area) + " " + w); }
      for (const p of PLAN) if (p[0] === today) lines.push("Send today: " + p[2]);
      if (u.owner && (pend || []).length) lines.push((pend || []).length + " family request" + ((pend || []).length > 1 ? "s" : "") + " waiting for your approval");
      if (today >= "2027-01-13") { const n = (plan || []).filter((x) => x.kind === "game" && x.data.status !== "Cancelled" && x.data.prize && /To buy|Bought/.test(x.data.prize_status || "To buy")).length; if (n) lines.push(n + " game prize" + (n > 1 ? "s" : "") + " still to buy or wrap"); }
      if (!lines.length) continue;
      await toAll([u], "digest:" + today + ":" + u.id, { title: "Wedding to-dos today (" + lines.length + ")", body: lines.slice(0, 6).join("\n") + (lines.length > 6 ? "\n+" + (lines.length - 6) + " more in the panel" : ""), url: "admin.html#remind", tag: "digest" }, 6 * 3600);
    }
  }
  // Keep the log small
  await db.from("notif_log").delete().lt("at", new Date(now - 14 * 864e5).toISOString());
  return json({ ok: true, sent });
});
