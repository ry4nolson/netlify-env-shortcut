const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const sizes = [16, 48, 128];

for (const size of sizes) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#00ad9f';
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, size * 0.2);
  ctx.fill();

  const pad = size * 0.15;
  const barH = size * 0.12;
  const gap = (size - pad * 2 - barH * 4) / 3;

  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 4; i++) {
    const y = pad + i * (barH + gap);
    const w = i % 2 === 0 ? size - pad * 2 : (size - pad * 2) * 0.65;
    ctx.beginPath();
    ctx.roundRect(pad, y, w, barH, barH / 2);
    ctx.fill();
  }

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(__dirname, `icon${size}.png`), buffer);
  console.log(`icon${size}.png`);
}
