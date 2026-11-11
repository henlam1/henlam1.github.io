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

  return regions.map((region) => {
    // Loop y from Math.floor(row * cellHeight) up to, not including, Math.floor((row + 1) * cellHeight).
    // Loop x the same way, using col and cellWidth.
    let total = 0;
    let count = 0;
    for (let y = Math.floor(cellY); y < Math.floor((row + 1) * cellHeight); y++) {
      for (let x = Math.floor(cellX); x < Math.floor((col + 1) * cellWidth); x++) {
        const dx = x + 0.5 - (cellX + region.x);
        const dy = y + 0.5 - (cellY + region.y);
        if (dx * dx + dy * dy <= region.radius * region.radius) {
          // For pixels inside this circle, add 1 - getLightness(image, x, y) to total and add 1 to count.
          total += 1 - getLightness(image, x, y);
          count += 1;
        }
      }
    }
    // Return total / count, or 0 if count is 0.
    return count > 0 ? total / count : 0;
  });
}
