import { getGameState } from './game-state';

export function printPromptToCanvas(prompt: string, ctx: CanvasRenderingContext2D) {
  const gameState = getGameState();
  const { height, width } = ctx.canvas;

  // calculate the font size by shrinking until the text fits
  let fontSize = 50;
  do {
    fontSize -= 2;
    ctx.font = `${fontSize}px serif`;
  } while (ctx.measureText(prompt).width > 700);

  ctx.fillStyle = gameState.gameSettings.backgroundColor;
  ctx.fillRect(0, 0, width, height);
  ctx.textAlign = 'center';
  ctx.fillStyle = gameState.gameSettings.fontColor;
  ctx.fillText(prompt, width / 2, height - 30);
}
