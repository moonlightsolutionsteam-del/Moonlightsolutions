/**
 * Live mirror of the wedding guest list (Supabase -> this Google Sheet).
 * The database sends every new or changed RSVP here; rows are matched by pass code.
 *
 * Setup: in the sheet, Extensions > Apps Script, paste this file, set SYNC_SECRET to the
 * value Claude gave you, then Deploy > New deployment > Web app,
 * Execute as "Me", Who has access "Anyone" > Deploy, and share the Web app URL.
 */
const SYNC_SECRET = 'PASTE_THE_SECRET_HERE';
const HEADERS = ['Pass Code', 'Name', 'Phone', 'Side', 'Day 1 (Wed 20)', 'Nikah (Thu AM)', 'Reception (Thu PM)', 'Guests', 'Note',
  'Table', 'Meal', 'Accommodation', 'Checked In', 'Checked In At', 'Removed', 'Submitted', 'Last Synced'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const d = JSON.parse(e.postData.contents);
    if (d.secret !== SYNC_SECRET) return reply({ ok: false, error: 'forbidden' });
    const r = d.record || {};
    const sh = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
    sh.setFrozenRows(1);

    const days = Array.isArray(r.days) ? r.days : [];
    const row = [r.pass_code, r.name, r.phone, r.side,
      days.indexOf(1) !== -1 ? 'Yes' : '', days.indexOf(2) !== -1 ? 'Yes' : '', days.indexOf(3) !== -1 ? 'Yes' : '',
      r.guests, r.note, r.table_no, r.meal, r.accommodation,
      r.checked_in ? 'Yes' : '', r.checked_in_at ? new Date(r.checked_in_at) : '',
      r.removed ? 'Yes' : '', r.created_at ? new Date(r.created_at) : '', new Date()]
      .map((v, i) => (i !== 2 && typeof v === 'string' && /^[=+\-@]/.test(v)) ? "'" + v : (v == null ? '' : v));

    const last = sh.getLastRow();
    let at = -1;
    if (last > 1) at = sh.getRange(2, 1, last - 1, 1).getValues().flat().indexOf(r.pass_code);
    const target = at === -1 ? last + 1 : at + 2;
    sh.getRange(target, 3).setNumberFormat('@');
    sh.getRange(target, 1, 1, row.length).setValues([row]);
    return reply({ ok: true, row: target });
  } catch (err) {
    return reply({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function reply(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
