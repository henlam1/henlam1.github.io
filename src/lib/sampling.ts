/**
 * Get lightness of a pixel in an image. 0.0 is black, 1.0 is white.
 *
 * @param image every pixel of the picture. image.data is one flat list:
 *              [r, g, b, a, r, g, b, a, ...], row by row, from the top left.
 * @param x column of the pixel to sample, 0 is leftmost
 * @param y row of the pixel to sample, 0 is topmost
 * @returns the lightness of the pixel, 0.0 (black) to 1.0 (white)
 */
export function getLightness(image: ImageData, x: number, y: number) {
  // https://en.wikipedia.org/wiki/Relative_luminance
  const index = (y * image.width + x) * 4;
  const r = image.data[index + 0];
  const g = image.data[index + 1];
  const b = image.data[index + 2];
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

/**
 * Get the six regions of a cell to sample for lightness. Each region is a circle, with a center and a radius.
 *
 * @param cellWidth the width of a cell in pixels
 * @param cellHeight the height of a cell in pixels
 * @returns the six regions of a cell to sample for lightness, each with a center and a radius
 */
export function getRegions(cellWidth: number, cellHeight: number) {
  const STAGGER = 0.04 * cellHeight; // how far to stagger the left and right columns, as a fraction of cellHeight
  const X_POS = [cellWidth * 0.25, cellWidth * 0.75]; // x positions of the two circles in each row
  const Y_POS = [(cellHeight * 1) / 6, (cellHeight * 1) / 2, (cellHeight * 5) / 6]; // y positions of the three rows of circles
  let regions: { x: number; y: number; radius: number }[] = [];
  for (let y of Y_POS) {
    for (let x of X_POS) {
      regions.push({ x, y: y + (x === X_POS[0] ? STAGGER : -STAGGER), radius: cellWidth / 3 });
    }
  }
  return regions;
}

/**
 * Get the vector for a cell in an image, based on the average lightness in six regions of the cell.
 *
 * @param image the image to sample, with pixels in image.data as a flat list: [r, g, b, a, r, g, b, a, ...], row by row, from the top left
 * @param col the column of the cell to sample, 0 is leftmost
 * @param row the row of the cell to sample, 0 is topmost
 * @param cellWidth the width of a cell in pixels
 * @param cellHeight the height of a cell in pixels
 * @param regions the six regions of a cell to sample for lightness, each with a center and a radius
 * @returns the vector for the cell, with six values
 */
export function getCellVector(
  image: ImageData,
  col: number,
  row: number,
  cellWidth: number,
  cellHeight: number,
  regions: { x: number; y: number; radius: number }[],
) {
  // The cell's top-left corner in the full image
  const cellX = col * cellWidth;
  const cellY = row * cellHeight;

  // Run once per circle. Each run returns one number (how much ink is in that
  // circle), so the result is a list with one number per circle.
  return regions.map((region) => {
    let total = 0; // ink added up over every pixel inside the circle
    let count = 0; // how many pixels were inside the circle

    // The circle's centre in the full image. region.x and region.y are
    // measured from the cell's corner, so add the cell's corner to them.
    const cx = cellX + region.x;
    const cy = cellY + region.y;

    // The box around the circle, in pixel numbers. The loops below go from
    // top up to (not including) bot, and from left up to (not including)
    // right, so bot and right are the first row/column NOT visited.
    // Math.max / Math.min stop the box at the cell's edges, because some
    // circles stick out of the cell.
    const top = Math.max(Math.floor(cy - region.radius), Math.floor(cellY));
    const bot = Math.min(Math.ceil(cy + region.radius), Math.floor(cellY + cellHeight));
    const left = Math.max(Math.floor(cx - region.radius), Math.floor(cellX));
    const right = Math.min(Math.ceil(cx + region.radius), Math.floor(cellX + cellWidth));

    // Radius squared, worked out once instead of for every pixel.
    const r2 = region.radius ** 2;

    // Visit every pixel in the box, one row (y) at a time, left to right (x).
    for (let y = top; y < bot; y++) {
      for (let x = left; x < right; x++) {
        // How far this pixel's centre is from the circle's centre.
        // (x, y) is the pixel's top-left corner; + 0.5 moves to its middle.
        const dx = x + 0.5 - cx;
        const dy = y + 0.5 - cy;

        // Pythagoras: the pixel is inside the circle when its distance from
        // the centre is at most the radius. Comparing squared values skips
        // the square root, which gives the same answer and is faster.
        if (dx * dx + dy * dy <= r2) {
          // getLightness is 1 for white paper and 0 for black ink, so
          // 1 - lightness is "how much ink": 0 for paper, 1 for solid ink.
          total += 1 - getLightness(image, x, y);
          count += 1;
        }
        // Pixels in the box's corners fail the check and are skipped.
      }
    }

    // The average ink in this circle, from 0 (empty) to 1 (full).
    // count is 0 only if the circle missed every pixel; return 0 instead
    // of dividing by zero.
    return count > 0 ? total / count : 0;
  });
}

export function enhanceContrast(vector: number[], exponent: number) {
  // Global contrast enhancement
  const max = Math.max(...vector);

  // Edge case if max === 0 so we avoid division by zero errors
  if (max === 0) return vector;

  // Normalize vector and enhance contrast with exponents before denormalizing
  const contrastEnhancedVector = vector.map((num) => {
    num = num / max; // Normalize
    num = Math.pow(num, exponent);
    num = num * max; // Denormalize
    return num;
  });
  return contrastEnhancedVector;
}
