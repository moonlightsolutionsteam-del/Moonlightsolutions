// Renders each kit/html/*.html page to kit/out/*.png at its own size
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const sizes = { poster: [1080, 1350], status: [1080, 1920], 'save-the-date': [1080, 1080], schedule: [1080, 1920], 'dress-code': [1080, 1920] };
(async () => {
  const b = await chromium.launch(); fs.mkdirSync(path.join(__dirname, 'out'), { recursive: true });
  for (const name of (process.argv[2] ? process.argv[2].split(',') : Object.keys(sizes))) {
    const [w, h] = sizes[name];
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.goto('file://' + path.join(__dirname, 'html', name + '.html'), { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
    const over = await p.evaluate(() => [...document.querySelectorAll('.center, .center *')].filter(e => e.scrollWidth > e.clientWidth + 2 && getComputedStyle(e).overflow !== 'visible').length);
    await p.screenshot({ path: path.join(__dirname, 'out', name + '.png') });
    console.log(name, w + 'x' + h, 'bottom of content:', await p.evaluate(() => Math.round(Math.max(...[...document.querySelectorAll('.center')].map(e => e.getBoundingClientRect().bottom)))));
    await p.close();
  }
  await b.close();
})();
