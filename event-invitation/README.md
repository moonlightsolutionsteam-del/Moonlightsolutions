# Event invitation

A single-page event invitation (`index.html`): hero with countdown, details, schedule, map link, add-to-calendar, and an RSVP form.

- All placeholder text ("Event Name", "Venue Name", dates, host) is in `index.html`; search for those to replace them.
- Date, location and RSVP email used by the countdown, calendar file and RSVP form are in the `EVENT` object near the bottom of the file.
- RSVPs open the guest's email app addressed to `EVENT.rsvpEmail` (no backend). Swap in Supabase like `../wedding-invitation` if you need stored responses.
- Styles come from the pre-built `site.css`. After changing Tailwind classes, rebuild from this folder: `printf '@tailwind base;@tailwind components;@tailwind utilities;' > /tmp/in.css && npx tailwindcss@3.4.17 -c tailwind.config.js -i /tmp/in.css -o site.css --minify`.
- Host the folder on any static host.
