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
  // The six circle centres, as [x, y] fractions of the cell's width and height.
  // Order: top left, top right, middle left, middle right, bottom left, bottom right.
  // From Alex Harri's article; the outside circles are positioned around these.
  const POINTS = [
    [0.3, 0.23],
    [0.7, 0.18],
    [0.3, 0.5],
    [0.7, 0.5],
    [0.3, 0.82],
    [0.7, 0.77],
  ];
  const radius = 0.28125 * Math.min(cellWidth, cellHeight);

  // Map each point into a region object
  return POINTS.map(([fx, fy]) => {
    return { x: fx * cellWidth, y: fy * cellHeight, radius };
  });
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
 * @param offsets the sample points to read in each circle, as distances from the circle's center (from getVogelOffsets)
 * @returns the vector for the cell, with six values
 */
export function getCellVector(
  image: ImageData,
  col: number,
  row: number,
  cellWidth: number,
  cellHeight: number,
  regions: { x: number; y: number; radius: number }[],
  offsets: { dx: number; dy: number }[],
) {
  // The cell's top-left corner in the full image
  const cellX = col * cellWidth;
  const cellY = row * cellHeight;

  // Run once per circle. Each run returns one number (how bright that
  // circle is), so the result is a list with one number per circle.
  return regions.map((region) => {
    let total = 0; // lightness added up over every sample point in the circle

    // The circle's centre in the full image. region.x and region.y are
    // measured from the cell's corner, so add the cell's corner to them.
    const cx = cellX + region.x;
    const cy = cellY + region.y;

    // Iterate each point sample
    for (let i = 0; i < offsets.length; i++) {
      // Unpack width and height offset values
      const { dx, dy } = offsets[i];

      // Calculate pixel positions of each sample point
      let x = Math.floor(cx + dx);
      let y = Math.floor(cy + dy);

      // Clamp sample point within the bounds of the image
      x = Math.max(0, Math.min(x, image.width - 1));
      y = Math.max(0, Math.min(y, image.height - 1));

      // Increment total
      total += getLightness(image, x, y);
    }

    // The average lightness over the sample points, from 0 (black) to 1 (white).
    return total / offsets.length;
  });
}

/**
 * Global contrast enhancement. Makes the brightest values in a vector stand out more from the dimmer ones, without changing the largest value.
 *
 * @param vector the values to enhance, from 0 (black) to 1 (white), e.g. a cell vector
 * @param exponent how strong the effect is. 1 changes nothing; higher values push the smaller values further down
 * @returns a new vector the same length as the input, with the contrast enhanced
 */
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

/**
 * Get evenly spread sample points inside a circle, using Vogel's method (a sunflower spiral). Point 0 is the center; each later point turns by the golden angle and moves further out.
 *
 * @param n how many sample points to make
 * @param radius the radius of the circle in pixels
 * @returns n offsets, each an x and y distance in pixels from the circle's center
 */
export function getVogelOffsets(n: number, radius: number) {
  const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
  const offsets: { dx: number; dy: number }[] = [];

  for (let i = 0; i < n; i++) {
    const angle = i * GOLDEN_ANGLE;
    const distance = radius * Math.sqrt(i / n);
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;
    offsets.push({ dx, dy });
  }
  return offsets;
}

/**
 * Get the ten regions just outside a cell, used by enhanceDirectional to see how bright it is next door.
 * Same radius as the six inside regions; positions can be below 0 or above the cell's size.
 *
 * @param cellWidth the width of a cell in pixels
 * @param cellHeight the height of a cell in pixels
 * @returns the ten outside regions (e0–e9), each with a center (measured from the cell's top-left corner) and a radius
 */
export function getExternalRegions(cellWidth: number, cellHeight: number) {
  // The ten outside circle centres, as [x, y] fractions of the cell's width and height.
  // Values below 0 or above 1 are outside the cell. Numbered e0–e9 in the article.
  const EXTERNAL_POINTS = [
    [0.07, -0.21], // e0 above, left
    [0.93, -0.21], // e1 above, right
    [-0.25, 0.07], // e2 left side, top
    [1.25, 0.07], // e3 right side, top
    [-0.25, 0.5], // e4 left side, middle
    [1.25, 0.5], // e5 right side, middle
    [-0.25, 0.93], // e6 left side, bottom
    [1.25, 0.93], // e7 right side, bottom
    [0.07, 1.21], // e8 below, left
    [0.93, 1.21], // e9 below, right
  ];

  const radius = 0.28125 * Math.min(cellWidth, cellHeight);

  // Map each point into a region object
  return EXTERNAL_POINTS.map(([fx, fy]) => {
    return { x: fx * cellWidth, y: fy * cellHeight, radius };
  });
}

/**
 * Directional contrast enhancement. Each inside circle is compared with the brightest area just outside the cell
 * on its side. If that neighbour is brighter, the circle's value is reduced, so faint spill-over from a nearby bright
 * shape disappears and edges between cells stay sharp. Run it before enhanceContrast.
 *
 * @param vector the six inside values of a cell, from 0 (black) to 1 (white), from getCellVector
 * @param externalVector the ten outside values (e0–e9), from getCellVector with getExternalRegions
 * @param exponent how strong the effect is. 1 changes nothing; higher values reduce faint circles more
 * @returns a new vector of six values, with the directional contrast applied
 */
export function enhanceDirectional(vector: number[], externalVector: number[], exponent: number) {
  // For each inside circle (0–5), the outside circles (e0–e9) next to it.
  // e.g. inside circle 0 (top left) is next to e0, e1 (above) and e2, e4 (left).
  const AFFECTING = [
    [0, 1, 2, 4], // 0 top left
    [0, 1, 3, 5], // 1 top right
    [2, 4, 6], // 2 middle left
    [3, 5, 7], // 3 middle right
    [4, 6, 8, 9], // 4 bottom left
    [5, 7, 8, 9], // 5 bottom right
  ];

  // Run once per inside circle. i is the circle's number (0–5).
  return vector.map((value, i) => {
    // The brightest value in this circle's area: itself, or one of the outside circles next to it.
    let max = value;
    for (let j = 0; j < AFFECTING[i].length; j++) {
      max = Math.max(max, externalVector[AFFECTING[i][j]]);
    }

    // All black here and next door: leave it, instead of dividing by zero.
    if (max === 0) return value;

    // Same three steps as enhanceContrast: divide (how bright compared with the area's brightest value),
    // raise to the power (shrink faint circles much more than bright ones), multiply (back to lightness).
    return (value / max) ** exponent * max;
  });
}
