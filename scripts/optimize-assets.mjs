import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const source = path.join(root, "assets", "source", "art");
const medalSource = path.join(root, "assets", "source", "boss-medals");
const publicImages = path.join(root, "public", "images");
const output = path.join(publicImages, "optimized");
const medalOutput = path.join(publicImages, "boss-medals");
const socialOutput = path.join(publicImages, "social");

await mkdir(output, { recursive: true });
await mkdir(medalOutput, { recursive: true });
await mkdir(socialOutput, { recursive: true });

async function webp(inputName, outputName, resize, quality = 74) {
  await sharp(path.join(source, inputName))
    .resize(resize)
    .webp({ quality, effort: 6, smartSubsample: true })
    .toFile(path.join(output, outputName));
}

await Promise.all([
  webp(
    "background.png",
    "hero-desktop.webp",
    { width: 1536, height: 1024, fit: "cover", position: "centre" },
    72,
  ),
  webp(
    "background.png",
    "hero-mobile.webp",
    { width: 900, height: 1200, fit: "cover", position: "centre" },
    70,
  ),
  webp(
    "mythstride-app-icon.png",
    "app-icon.webp",
    { width: 192, height: 192, fit: "cover" },
    82,
  ),
  webp(
    "boss-arpia.png",
    "boss-arpia.webp",
    { width: 720, height: 720, fit: "cover", position: "top" },
    75,
  ),
  webp(
    "boss-dragao-ancestral.png",
    "boss-dragao.webp",
    { width: 720, height: 720, fit: "cover", position: "top" },
    75,
  ),
  webp(
    "lich-do-abismo.png",
    "boss-lich.webp",
    { width: 720, height: 720, fit: "cover", position: "top" },
    75,
  ),
  webp(
    "fire_sword.png",
    "founder-sword.webp",
    { width: 640, height: 640, fit: "contain" },
    78,
  ),
  webp(
    "aethron-scroll-bg.png",
    "aethron-scroll-bg.webp",
    { width: 1200, height: 900, fit: "cover", position: "centre" },
    72,
  ),
]);

const medalFiles = (await readdir(medalSource)).filter((filename) =>
  filename.toLowerCase().endsWith(".png"),
);

await Promise.all(
  medalFiles.map(async (filename) => {
    const outputName = `${path.parse(filename).name}.webp`;

    await sharp(path.join(medalSource, filename))
      .resize({
        width: 384,
        height: 384,
        fit: "contain",
        withoutEnlargement: true,
      })
      .webp({ quality: 78, effort: 6, alphaQuality: 88 })
      .toFile(path.join(medalOutput, outputName));
  }),
);

const logo = await sharp(path.join(source, "mythstride-logo.png"))
  .resize({ width: 540, withoutEnlargement: true })
  .png()
  .toBuffer();

const darkOverlay = await sharp({
  create: {
    width: 1200,
    height: 630,
    channels: 4,
    background: { r: 9, g: 7, b: 6, alpha: 0.5 },
  },
})
  .png()
  .toBuffer();

await sharp(path.join(source, "background.png"))
  .resize({ width: 1200, height: 630, fit: "cover", position: "centre" })
  .composite([
    { input: darkOverlay, blend: "over" },
    { input: logo, gravity: "centre" },
  ])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(path.join(socialOutput, "mythstride-og.jpg"));

console.log("Optimized public assets generated.");
