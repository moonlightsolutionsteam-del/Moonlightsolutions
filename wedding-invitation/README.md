# Nadeem & Dariya wedding invitation

- `index.html` is the invitation. RSVPs are saved to the Supabase project `nadeem-dariya-wedding`.
- `admin.html` is the private guest list and door scanner. It asks for the admin passphrase (stored only as a hash in the database).
- `qrcode.js` (MIT) draws the QR on entry passes. `jsQR.js` (Apache-2.0) reads QR codes in the door scanner.
- Host the whole folder on any static host and share only the link to `index.html`.

## Link preview

`og.jpg` is the image shown when the link is shared on WhatsApp and similar apps. Once the site is live, change the `og:image` tag in `index.html` to the full address, e.g. `https://your-site/og.jpg`; WhatsApp ignores relative paths.

## Styles (site.css)

The invitation uses a pre-built Tailwind stylesheet, `site.css`, instead of the Tailwind CDN so it loads fast on phones.
After adding or changing Tailwind classes in `index.html`, rebuild it from this folder:

    printf '@tailwind base;@tailwind components;@tailwind utilities;' > /tmp/in.css
    npx tailwindcss@3.4.17 -c tailwind.config.js -i /tmp/in.css -o site.css --minify
