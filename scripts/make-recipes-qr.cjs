// One-off: generate the staff recipe book QR code (SVG + PNG).
// Points straight at https://yomore.com.au/recipes, no redirect service.
// Error correction H, 4-module white quiet zone, PNG 1200 px.
//
// Needs the `qrcode` npm package (not a site dependency). Run from the repo root:
//   npm i --no-save qrcode && node scripts/make-recipes-qr.cjs
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const URL = 'https://yomore.com.au/recipes';
const OUT = path.join(__dirname, '..', 'recipes', 'qr');
const opts = { errorCorrectionLevel: 'H', margin: 4, color: { dark: '#000000', light: '#FFFFFF' } };

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const svg = await QRCode.toString(URL, { ...opts, type: 'svg' });
  fs.writeFileSync(path.join(OUT, 'recipes-qr.svg'), svg);
  await QRCode.toFile(path.join(OUT, 'recipes-qr.png'), URL, { ...opts, type: 'png', width: 1200 });
  console.log('wrote recipes/qr/recipes-qr.svg and recipes-qr.png for', URL);
})();
