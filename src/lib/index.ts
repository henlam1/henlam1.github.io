import { getCharacterVectors, getNearestCharacter, normalizeVectors } from './characters.js';
import { getCellVector, getRegions } from './sampling.js';

// Your ASCII renderer. The lab page (src/pages/lab.astro) calls toAscii()
// and prints the result, so open http://localhost:4321/lab while you work.
//
// Build it up in steps, following Alex Harri's article
// (alexharri.com/blog/ascii-rendering):
//   1. Brightness: give each cell one brightness and pick a character from CHARS.
//   2. Sharper: sample several points per cell and match that pattern to the
//      shape of each character (the article's "shape vectors").

// List of every printable character, from space to tilde. The ASCII table has 95 printable characters, from 32 (space) to 126 (tilde).
export const CHARS = Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i));

// Cached variables so we don't have to recompute every time in toAscii
let cachedWidth: number | null = null;
let cachedHeight: number | null = null;
let cachedNormalizedVectors: { char: string; vector: number[] }[] | null = null;

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
  const cellHeight = image.height / rows; // how many pixels down each character covers
  const regions = getRegions(cellWidth, cellHeight);

  // Build the character vectors and normalized vectors once per cell update, and cache them for future calls to toAscii(). This is important because getCharacterVectors() is expensive, and we don't want to do it every time we render a new image.
  if (
    cachedWidth !== cellWidth ||
    cachedHeight !== cellHeight ||
    cachedNormalizedVectors === null
  ) {
    cachedWidth = cellWidth;
    cachedHeight = cellHeight;
    const characterVectors = getCharacterVectors(CHARS, cellWidth, cellHeight);
    cachedNormalizedVectors = normalizeVectors(characterVectors);
  }

  const lines: string[] = [];
  for (let row = 0; row < rows; row++) {
    let line = '';
    for (let col = 0; col < cols; col++) {
      // Version 2: shape matching
      const cellVector = getCellVector(image, col, row, cellWidth, cellHeight, regions);
      line += getNearestCharacter(cellVector, cachedNormalizedVectors);
    }
    lines.push(line);
  }
  return lines;
}
