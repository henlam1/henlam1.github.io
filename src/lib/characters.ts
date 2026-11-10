import { getLightness, getRegions } from './sampling';

/**
 * Get the font to use for drawing ASCII characters, based on the width of a cell.
 *
 * @param cellWidth the width of a cell in pixels
 * @returns the font string to use for the canvas context
 */
export function getFont(cellWidth: number) {
  return `${cellWidth * 1.6}px ui-monospace, Menlo, Consolas, monospace`;
}

/**
 * Get the baseline offset for drawing text in a cell, so that the text is vertically centered.
 *
 * @param ctx the canvas rendering context used to measure text
 * @param cellHeight the height of a cell in pixels
 * @returns the offset from the top of the cell to the baseline of the text
 */
export function getBaselineOffset(ctx: CanvasRenderingContext2D, cellHeight: number) {
  const metrics = ctx.measureText('H');
  const ascent = metrics.actualBoundingBoxAscent;
  const descent = metrics.actualBoundingBoxDescent;
  return (cellHeight - (ascent + descent)) / 2 + ascent;
}

/**
 * Get the vectors for a list of characters, based on their lightness in two regions of a cell.
 *
 * @param chars characters to measure
 * @param cellWidth width of a cell in pixels
 * @param cellHeight height of a cell in pixels
 * @returns the list of characters with their corresponding vectors, where each vector has two values: the average lightness in the top region and the average lightness in the bottom region
 */
export function getCharacterVectors(chars: string[], cellWidth: number, cellHeight: number) {
  // 1. Make the two circles (the regions list from part 2)
  const regions = getRegions(cellWidth, cellHeight);

  // 2. Make the hidden canvas and set its size
  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil(cellWidth);
  canvas.height = Math.ceil(cellHeight);

  // 3. Get the context, then set font and textBaseline
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    throw new Error('Unable to get canvas rendering context');
  }
  ctx.font = getFont(cellWidth);
  ctx.textBaseline = 'alphabetic';

  // 4. Get the offset with getBaselineOffset
  const offset = getBaselineOffset(ctx, cellHeight);

  return chars.map((char) => {
    // 5. Fill the canvas black, draw the character in white, read the pixels
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillText(char, 0, offset);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const vector = regions.map((region) => {
      // 6. Loop over every pixel. For pixels inside this circle,
      //    add up getLightness and count them.
      let total: number = 0;
      let count: number = 0;
      for (let y = 0; y < imageData.height; y++) {
        for (let x = 0; x < imageData.width; x++) {
          const dx = x + 0.5 - region.x;
          const dy = y + 0.5 - region.y;
          if (dx * dx + dy * dy <= region.radius * region.radius) {
            total += getLightness(imageData, x, y);
            count += 1;
          }
        }
      }
      // 7. Return the total divided by the count.
      return total / count;
    });

    return { char, vector };
  });
}

/**
 * Normalize the vectors for a list of characters, so that each position in the vector is between 0 and 1.
 *
 * @param characters characters to normalize, each with a vector of numbers
 * @returns the same list, with each vector normalized so that each position is between 0 and 1
 */
export function normalizeVectors(characters: { char: string; vector: number[] }[]) {
  // 1. For each position in the vector, find the largest value across all characters
  const maxes: number[] = [];
  const positions = characters[0].vector.length; // 2
  for (let i = 0; i < positions; i++) {
    maxes.push(Math.max(...characters.map(({ vector }) => vector[i])));
  }

  // 2. Return the same list, with each value divided by the largest value for its position
  return characters.map((character) => {
    const normalizedVector = character.vector.map((value, i) => value / maxes[i]);
    return { char: character.char, vector: normalizedVector };
  });
}

/**
 * Get the character whose vector is closest to the given cell vector, using Euclidean distance.
 *
 * @param cellVector the vector for the cell, with two values: the average lightness in the top region and the average lightness in the bottom region
 * @param characters the list of characters with their corresponding vectors, where each vector has two values: the average lightness in the top region and the average lightness in the bottom region
 * @returns the character whose vector is closest to the cell vector, using Euclidean distance
 */
export function getNearestCharacter(
  cellVector: number[],
  characters: { char: string; vector: number[] }[],
) {
  let bestChar = ' ';
  let bestDistance = Infinity;

  for (const { char, vector } of characters) {
    let distance = 0;
    // For each position i, add (cellVector[i] - vector[i]) squared to distance.
    let dimensions = cellVector.length;
    for (let i = 0; i < dimensions; i++) {
      distance += (cellVector[i] - vector[i]) * (cellVector[i] - vector[i]);
    }

    // If distance is smaller than bestDistance, update bestChar and bestDistance.
    if (distance < bestDistance) {
      bestChar = char;
      bestDistance = distance;
    }
  }

  return bestChar;
}
