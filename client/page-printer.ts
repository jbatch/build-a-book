export function printPromptToCanvas(prompt: string, ctx: CanvasRenderingContext2D, clearCanvas?: boolean) {
  const { height, width } = ctx.canvas;

  // calculate the font size by shrinking until the text fits
  let fontSize = 50;
  do {
    fontSize -= 2;
    ctx.font = `${fontSize}px serif`;
  } while (ctx.measureText(prompt).width > 700);

  if (clearCanvas) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
  }
  ctx.textAlign = 'center';
  ctx.fillStyle = '#00ff00';
  ctx.fillText(prompt, width / 2, height - 30);
}
