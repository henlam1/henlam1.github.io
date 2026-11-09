// Your ASCII renderer. The lab page (src/pages/lab.astro) calls toAscii()
// and prints the result, so open http://localhost:4321/lab while you work.
//
// Build it up in steps, following Alex Harri's article
// (alexharri.com/blog/ascii-rendering):
//   1. Brightness: give each cell one brightness and pick a character from CHARS.
//   2. Sharper: sample several points per cell and match that pattern to the
//      shape of each character (the article's "shape vectors").

// Characters from lightest to darkest. Try your own.
export const CHARS = [" ", ".", ":", "-", "=", "+", "*", "#", "%", "@"]

function getLightness(image: ImageData, x: number, y: number) {
  // https://en.wikipedia.org/wiki/Relative_luminance
  const r = image.data[(y * image.width + x) * 4 + 0];
  const g = image.data[(y * image.width + x) * 4 + 1];
  const b = image.data[(y * image.width + x) * 4 + 2];
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

function getCharacterFromLightness(lightness: number) {
  const index = Math.round(lightness * (CHARS.length - 1));
  return CHARS[index];
}

/**
 * Turn an image into rows of characters.
 *
 * @param image every pixel of the picture. image.data is one flat list:
 *              [r, g, b, a, r, g, b, a, ...], row by row, from the top left.
 * @param cols  how many characters wide the result should be
 * @param rows  how many characters tall
 * @returns     one string per row, each `cols` characters long
 */
export function toAscii(image: ImageData, cols: number, rows: number): string[] {
  const cellWidth = image.width / cols; // how many pixels across each character covers
  const cellHeight = image.height / rows; // how many pixels down

  const lines: string[] = [];
  for (let row = 0; row < rows; row++) {
    let line = '';
    for (let col = 0; col < cols; col++) {
      const x = Math.floor((col + 0.5) * cellWidth);
      const y = Math.floor((row + 0.5) * cellHeight);
      const lightness = getLightness(image, x, y)
      line += getCharacterFromLightness(lightness);
    }
    lines.push(line);
  }
  return lines;
}
