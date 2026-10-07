// Kør: NODE_PATH=$(npm root -g) node tests/slutskaerm.test.js
// Valgfrit: SCREENSHOT_DIR=<mappe> gemmer skærmbilleder af slutskærm og scorekort.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT = path.resolve(__dirname, '..');
const URL_FILE = 'file://' + path.join(ROOT, 'index.html');
const DFU_LINK = 'https://dfu.gomember.dk/Account/RegisterMember';
const SHOTS = process.env.SCREENSHOT_DIR;
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
let ok = 0;
const check = (name, fn) => { fn(); ok++; console.log('ok  - ' + name); };

// ---- statiske tjek på kildeteksten ----
check('ingen "Dansk Folkeparti" uden "s Ungdom"', () => assert(!/Dansk Folkeparti(?!s Ungdom)/.test(html)));
check('det gamle DF-link er væk', () => assert(!html.includes('danskfolkeparti-groups.membersite.dk')));
check('sluttekst er opdateret', () => assert(html.includes('Du kan selvfølgelig også gøre noget ved det - og blive medlem af Dansk Folkepartis Ungdom i dag!')));
check('og:title, og:description og og:image findes', () => {
  for (const p of ['og:title', 'og:description', 'og:image']) assert(new RegExp('<meta property="' + p + '" content="[^"]+"').test(html), p);
});
check('og:description nævner DFU og har hverken tal eller citationstegn', () => {
  const d = html.match(/property="og:description" content="([^"]*)"/)[1];
  assert(d.includes('Dansk Folkepartis Ungdom')); assert(!/\d/.test(d)); assert(!/["“”«»']/.test(d));
});
check('og:image peger på en fil, der ligger i depotet', () => {
  const f = html.match(/property="og:image" content="https?:\/\/[^/]+\/([^"]+)"/)[1];
  assert(fs.existsSync(path.join(ROOT, f)), f);
});
check('logoet er indlejret (spillet er stadig én fil)', () => assert(html.includes("const DFLOGO = 'data:image/png;base64,")));

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
  for (const [label, vp] of [['mobil', { width: 390, height: 844 }], ['pc', { width: 1280, height: 900 }]]) {
    const page = await browser.newPage({ viewport: vp, deviceScaleFactor: 2 });
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.goto(URL_FILE);
    await page.evaluate(() => { home = 14; lost = 9; document.getElementById('start').hidden = true; finish(); });
    await page.locator('.df').scrollIntoViewIfNeeded();

    // links
    const links = await page.$$eval('.df a', as => as.map(a => ({ href: a.href, target: a.target, rel: a.rel, text: a.textContent.trim(), hasImg: !!a.querySelector('img') })));
    check(label + ': logo, tekst og knap linker til DFU, åbner i ny fane', () => {
      assert.strictEqual(links.length, 3);
      for (const l of links) { assert.strictEqual(l.href, DFU_LINK); assert.strictEqual(l.target, '_blank'); assert(l.rel.includes('noopener')); }
      assert(links.some(l => l.hasImg)); assert(links.some(l => l.text.includes('Dansk Folkepartis Ungdom')));
    });

    // logo: vist, ikke strakt, på hvid flade
    const m = await page.$eval('#dfLogo', i => {
      const r = i.getBoundingClientRect(), b = i.parentElement.getBoundingClientRect(), cs = getComputedStyle(i.parentElement);
      return { w: r.width, h: r.height, nw: i.naturalWidth, nh: i.naturalHeight, hidden: i.hidden, bg: cs.backgroundColor, radius: cs.borderTopLeftRadius, fit: getComputedStyle(i).objectFit, bw: b.width, vw: innerWidth, alt: i.alt, filter: getComputedStyle(i).filter };
    });
    check(label + ': logoet vises i hvidt felt med afrundede hjørner', () => {
      assert(!m.hidden); assert.strictEqual(m.bg, 'rgb(255, 255, 255)'); assert(parseFloat(m.radius) > 0);
      assert.strictEqual(m.alt, 'Dansk Folkepartis Ungdom'); assert.strictEqual(m.filter, 'none');
    });
    check(label + ': logoets proportioner er uændrede og det passer på skærmen', () => {
      assert.strictEqual(m.nw, 629); assert.strictEqual(m.nh, 317);
      assert(Math.abs(m.w / m.h - 629 / 317) < 0.01, 'aspect ' + m.w / m.h);
      assert(m.bw <= m.vw);
    });
    check(label + ': ingen JavaScript-fejl', () => assert.deepStrictEqual(errors, []));
    const sw = await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth);
    check(label + ': siden er ikke bredere end skærmen', () => assert(sw));

    if (SHOTS) {
      fs.mkdirSync(SHOTS, { recursive: true });
      await page.screenshot({ path: path.join(SHOTS, 'slutskaerm-' + label + '.png'), fullPage: false });
      await page.locator('.df').screenshot({ path: path.join(SHOTS, 'slutskaerm-' + label + '-udsnit.png') });
      const png = await page.evaluate(() => scoreCard().toDataURL('image/png').split(',')[1]);
      fs.writeFileSync(path.join(SHOTS, 'scorekort-' + label + '.png'), Buffer.from(png, 'base64'));
      // scorekortet, som det ser ud i en visning på skærmens bredde
      const p2 = await browser.newPage({ viewport: vp, deviceScaleFactor: 1 });
      await p2.goto(URL_FILE);
      await p2.evaluate(() => { home = 14; lost = 9; document.getElementById('start').hidden = true; finish(); const im = document.getElementById('shareImg'); im.src = scoreCard().toDataURL('image/png'); im.hidden = false; im.style.maxWidth = 'min(90vw,420px)'; im.style.width = 'min(90vw,420px)'; });
      await p2.locator('#shareImg').scrollIntoViewIfNeeded();
      await p2.screenshot({ path: path.join(SHOTS, 'scorekort-' + label + '-visning.png') });
      await p2.close();
    }
    await page.close();
  }
  await browser.close();
  console.log('\n' + ok + ' tjek bestået');
})().catch(e => { console.error('FEJL:', e.message); process.exit(1); });
