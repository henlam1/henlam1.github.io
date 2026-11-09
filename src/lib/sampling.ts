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
