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