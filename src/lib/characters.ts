export function getFont(cellWidth: number) {
  return `${cellWidth * 1.6}px ui-monospace, Menlo, Consolas, monospace`;
}

export function getBaselineOffset(ctx: CanvasRenderingContext2D, cellHeight: number) {
  const metrics = ctx.measureText('H');
  const ascent = metrics.actualBoundingBoxAscent;
  const descent = metrics.actualBoundingBoxDescent;
  return (cellHeight - (ascent + descent)) / 2 + ascent;
}