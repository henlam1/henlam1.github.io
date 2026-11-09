import { getAverageLightness, samplePoints } from './sampling.js'

// Your ASCII renderer. The lab page (src/pages/lab.astro) calls toAscii()
// and prints the result, so open http://localhost:4321/lab while you work.
//
// Build it up in steps, following Alex Harri's article
// (alexharri.com/blog/ascii-rendering):
//   1. Brightness: give each cell one brightness and pick a character from CHARS.
//   2. Sharper: sample several points per cell and match that pattern to the
//      shape of each character (the article's "shape vectors").

// Characters from least to most dense. Try your own.
export const CHARS = [" ", ".", ":", "-", "=", "+", "*", "#", "%", "@"]

// Sample points across and down each cell, so 3 means 9 points per cell.
const SAMPLES_PER_SIDE = 3;

/**
 * Get the character that corresponds to a density value. The least dense character is at index 0, the most dense at the last index.
 * 
 * @param density how much of the cell the character should fill, 0.0 (none) to 1.0 (full)
 * @returns the ascii symbol the density maps to
 */
function getCharacterFromDensity(density: number) {
  const index = Math.round(density * (CHARS.length - 1));
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
      // Sample points in the cell and average their lightness to pick a character.
      const points = samplePoints(col, row, cellWidth, cellHeight, SAMPLES_PER_SIDE);
      const lightness = getAverageLightness(image, points);
      line += getCharacterFromDensity(1 - lightness);
    }
    lines.push(line);
  }
  return lines;
}
