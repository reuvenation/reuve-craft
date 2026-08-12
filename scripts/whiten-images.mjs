/**
 * Выравнивает фон рендеров в чистый белый.
 *
 * У исходных кадров фон 250–254, а страница белая (255) — из-за этого на
 * лендинге видна прямоугольная рамка вокруг каждого фото. Скрипт тянет к
 * белому только светлые пиксели: всё, что светлее HI, становится 255,
 * диапазон LO…HI подмешивается плавно, чтобы не появилась ступенька на
 * границе тени. Оригиналы сохраняются в public/images/_orig/.
 *
 * Запуск: node scripts/whiten-images.mjs
 */
import { mkdir, copyFile, readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const DIR = path.join(process.cwd(), "public", "images");
const BACKUP = path.join(DIR, "_orig");
const LO = 238;
const HI = 249;

const files = (await readdir(DIR)).filter((f) => f.endsWith(".jpg"));
await mkdir(BACKUP, { recursive: true });

for (const file of files) {
  const src = path.join(DIR, file);
  const backup = path.join(BACKUP, file);
  await copyFile(src, backup);

  const { data, info } = await sharp(backup)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const m = Math.min(r, g, b);
    if (m >= HI) {
      data[i] = data[i + 1] = data[i + 2] = 255;
    } else if (m > LO) {
      const t = (m - LO) / (HI - LO);
      data[i] = Math.round(r + (255 - r) * t);
      data[i + 1] = Math.round(g + (255 - g) * t);
      data[i + 2] = Math.round(b + (255 - b) * t);
    }
  }

  await sharp(data, { raw: { width, height, channels } })
    .jpeg({ quality: 86, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(src);

  console.log(`${file}: фон выровнен (${width}×${height})`);
}
