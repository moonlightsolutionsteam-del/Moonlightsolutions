import { event } from '../data/invitation';

// The data file holds IST wall-clock times; convert to UTC for the calendar formats.
const toUTC = (iso: string) => new Date(iso + '+05:30');
const fmt = (d: Date) => d.toISOString().replace(/[-:]|\.\d{3}/g, '');
const location = () => `${event.venue}, ${event.city}`;

export function downloadIcs() {
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Genesis Internationale//Invitation//EN', 'BEGIN:VEVENT',
    `UID:genesis-${fmt(toUTC(event.startISO))}@genesis-internationale`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(toUTC(event.startISO))}`,
    `DTEND:${fmt(toUTC(event.endISO))}`,
    `SUMMARY:${event.title}`,
    `LOCATION:${location()}`,
    'END:VEVENT', 'END:VCALENDAR',
  ];
  const url = URL.createObjectURL(new Blob([lines.join('\r\n')], { type: 'text/calendar' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = 'genesis-internationale-meeting.ics';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function googleCalendarUrl() {
  const p = new URLSearchParams({
    action: 'TEMPLATE', text: event.title, location: location(),
    dates: `${fmt(toUTC(event.startISO))}/${fmt(toUTC(event.endISO))}`,
  });
  return `https://calendar.google.com/calendar/render?${p}`;
}
