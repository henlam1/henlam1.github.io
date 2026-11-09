/**
 * Get lightness of a pixel in an image. 0.0 is black, 1.0 is white.
 * 
 * @param image every pixel of the picture. image.data is one flat list:
 *              [r, g, b, a, r, g, b, a, ...], row by row, from the top left.
 * @param x column of the pixel to sample, 0 is leftmost
 * @param y row of the pixel to sample, 0 is topmost
 * @returns the lightness of the pixel, 0.0 (black) to 1.0 (white)
 */
function getLightness(image: ImageData, x: number, y: number) {
  // https://en.wikipedia.org/wiki/Relative_luminance
  const r = image.data[(y * image.width + x) * 4 + 0];
  const g = image.data[(y * image.width + x) * 4 + 1];
  const b = image.data[(y * image.width + x) * 4 + 2];
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

/**
 * Get the average lightness of a set of points in an image.
 * 
 * @param image every pixel of the picture. image.data is one flat list:
 *              [r, g, b, a, r, g, b, a, ...], row by row, from the top left.
 * @param points a list of points to sample, each with x and y coordinates
 * @returns the average lightness of the points, 0.0 (black) to 1.0 (white)
 */
export function getAverageLightness(image: ImageData, points: { x: number; y: number }[]) {
  let totalLightness = 0;
  for (const point of points) {
    totalLightness += getLightness(image, point.x, point.y);
  }
  return totalLightness / points.length;
}

/**
 * Get an evenly spaced grid of sample points within a cell of an image.
 * The points are the same on every call, so the same image always gives the same result.
 *
 * @param col the column of the cell, 0 is leftmost
 * @param row the row of the cell, 0 is topmost
 * @param cellWidth the width of the cell in pixels
 * @param cellHeight the height of the cell in pixels
 * @param pointsPerSide how many points across and down, so 3 gives a 3x3 grid of 9 points
 * @returns a list of points with x and y coordinates, each within the bounds of the cell
 */
export function samplePoints(col: number, row: number, cellWidth: number, cellHeight: number, pointsPerSide: number): { x: number; y: number }[] {
    const points = [];
    for (let j = 0; j < pointsPerSide; j++) {
        for (let i = 0; i < pointsPerSide; i++) {
            // The + 0.5 centers each point in its share of the cell.
            // With one point per side, this is the center of the cell.
            const x = Math.floor((col + (i + 0.5) / pointsPerSide) * cellWidth);
            const y = Math.floor((row + (j + 0.5) / pointsPerSide) * cellHeight);
            points.push({ x, y });
        }
    }
    return points;
}
