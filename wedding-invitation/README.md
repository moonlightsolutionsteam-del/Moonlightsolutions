# Nadeem & Dariya wedding invitation

- `index.html` is the invitation. RSVPs are saved to the Supabase project `nadeem-dariya-wedding`.
- `admin.html` is the private guest list and door scanner. It asks for the admin passphrase (stored only as a hash in the database).
- `qrcode.js` (MIT) draws the QR on entry passes. `jsQR.js` (Apache-2.0) reads QR codes in the door scanner.
- Host the whole folder on any static host and share only the link to `index.html`.
