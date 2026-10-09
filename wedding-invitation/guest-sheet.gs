/**
 * Receives RSVPs from the wedding invitation page and adds them as rows
 * to the first tab of this Google Sheet.
 *
 * Setup: open the sheet > Extensions > Apps Script > paste this file >
 * Deploy > New deployment > type "Web app" > Execute as "Me",
 * Who has access "Anyone" > Deploy > copy the Web app URL.
 */
const DAY_COLUMNS = 3;   // Day 1, Day 2, Day 3
const CHECKED_IN_COL = 14;

// Stops text such as "=1+1" from being read as a formula
const safe = v => {
  v = String(v == null ? '' : v).slice(0, 500);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
};

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const d = JSON.parse(e.postData.contents);
    const code = safe(d.code);
    if (!/^[A-Z0-9]{6}$/.test(code)) return reply({ ok: false, error: 'bad code' });

    const sh = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    const last = sh.getLastRow();
    if (last > 1) {
      const codes = sh.getRange(2, 2, last - 1, 1).getValues().flat();
      if (codes.indexOf(code) !== -1) return reply({ ok: true, duplicate: true });
    }

    const attending = Array.isArray(d.events) ? d.events : [];
    const days = [1, 2, 3].map(n => (attending.indexOf(n) !== -1 ? 'Yes' : ''));
    sh.appendRow([new Date(), code, safe(d.name), '', safe(d.side), days[0], days[1], days[2],
      Math.max(1, Math.min(15, +d.guests || 1)), safe(d.note), '', '', '', '']);
    const r = sh.getLastRow();
    sh.getRange(r, 4).setNumberFormat('@').setValue(String(d.phone || '').slice(0, 30));
    sh.getRange(r, CHECKED_IN_COL).insertCheckboxes();
    return reply({ ok: true });
  } catch (err) {
    return reply({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function reply(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
