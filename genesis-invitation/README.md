# Genesis Internationale invitation

Mobile-first invitation page: gift-opening intro, animated hero, notice, people hierarchy, timeline, 78 member panels with name search, calendar and WhatsApp actions.

Stack: Vite, React, TypeScript, Tailwind CSS 3, Framer Motion (LazyMotion).

## Edit content
Everything is in `src/data/invitation.ts` (event details, agenda, people, timeline, members, signature). Members are grouped into panels of 6 automatically; add `role` to any member to show a line under the name. Set `event.venueMapUrl` to show the "Get directions" button. Add `public/chief.jpg` and set `chief.photo` for a portrait (a monogram shows otherwise).

Optional background music: drop `public/music.mp3`; the speaker button appears automatically and never autoplays.

## Run
    npm install
    npm run dev        # local
    npm run build      # production build in dist/

## Deploy to Vercel
    npm i -g vercel
    vercel login
    vercel --prod      # framework Vite, output dist (vercel.json is included)

After the first deploy, change the `og:image` and `twitter:image` URLs in `index.html` to the full address, e.g. `https://your-site.vercel.app/og.png`. WhatsApp ignores relative image paths. Redeploy.
