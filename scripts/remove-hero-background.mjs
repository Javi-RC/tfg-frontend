/**
 * Strips the white backdrop and lavender blob from a landing illustration so it
 * sits on the page's own background instead of in a white box.
 *
 * Re-run it whenever one of the source images is replaced:
 *
 *   npm i -D sharp
 *   node scripts/remove-hero-background.mjs                     # all of them
 *   node scripts/remove-hero-background.mjs <source> <output>   # just one
 *
 * `sharp` is not a project dependency — this is a one-off asset tool, not part
 * of the build, so install it only when you need to regenerate a cut-out.
 */
import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const assets = (name) => path.join(here, '..', 'src', 'assets', name);

// Source -> cut-out, for every illustration the landing page uses.
const ILLUSTRATIONS = [
  { source: assets('ladingpage.png'), output: assets('hero-illustration.png') },
  { source: assets('landingpage-2.png'), output: assets('about-illustration.png') },
];

// Anything at or above this on all three channels counts as backdrop white.
const WHITE_THRESHOLD = 246;

/**
 * The pale lavender blob behind the figure: light overall, with a blue channel
 * clearly ahead of the green one. Matched by tint rather than by exact value so
 * the soft gradient at its edges goes too.
 */
function isBlob(r, g, b) {
  return r > 222 && g > 218 && b > 235 && b - g > 6;
}

/**
 * Clears the background by flood-filling inwards from the edges, so only pixels
 * genuinely connected to the outside are erased.
 *
 * A plain "every light pixel becomes transparent" pass would punch holes
 * through the white cards, the laptop and the plant pot, which are the same
 * colour as the backdrop. Working from the border keeps enclosed shapes intact,
 * and leaves the floating sparkles alone because the fill flows around them.
 */
async function removeBackground({ source, output }) {
  const image = sharp(source).ensureAlpha();
  const { width, height } = await image.metadata();
  const data = await image.raw().toBuffer();

  const offset = (x, y) => (y * width + x) * 4;
  const isBackground = (x, y) => {
    const i = offset(x, y);
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    const isWhite = r >= WHITE_THRESHOLD && g >= WHITE_THRESHOLD && b >= WHITE_THRESHOLD;
    return isWhite || isBlob(r, g, b);
  };

  // Iterative fill: a recursive one overflows the stack on a million pixels.
  const seen = new Uint8Array(width * height);
  const stack = [];
  for (let x = 0; x < width; x += 1) stack.push([x, 0], [x, height - 1]);
  for (let y = 0; y < height; y += 1) stack.push([0, y], [width - 1, y]);

  let cleared = 0;
  while (stack.length) {
    const [x, y] = stack.pop();
    if (x < 0 || y < 0 || x >= width || y >= height) continue;

    const flat = y * width + x;
    if (seen[flat]) continue;
    seen[flat] = 1;
    if (!isBackground(x, y)) continue;

    data[offset(x, y) + 3] = 0;
    cleared += 1;
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }

  await sharp(data, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 9, palette: true })
    .toFile(output);

  const percent = ((cleared / (width * height)) * 100).toFixed(1);
  console.log(`Cleared ${percent}% of pixels -> ${path.relative(process.cwd(), output)}`);
}

const [source, output] = process.argv.slice(2);
const targets = source && output ? [{ source, output }] : ILLUSTRATIONS;

for (const target of targets) {
  await removeBackground(target);
}
