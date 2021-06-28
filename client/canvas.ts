import { debounce } from 'throttle-debounce';

import { GameState, getGameState } from './game-state';
import { getMousePos } from './input';
import { getCurrentColor, getCurrentSize } from './local-storage';
import { printPromptToCanvas } from './page-printer';

const FPS = 60;
const height = 450;
const width = 800;

let canvas: HTMLCanvasElement;
let playerCanvas: HTMLCanvasElement;
let previewCanvas: HTMLCanvasElement;

let ctx: CanvasRenderingContext2D;
let playerCtx: CanvasRenderingContext2D;

let renderInterval: ReturnType<typeof setInterval>;

function initCanvas() {
  canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  playerCanvas = document.getElementById('player-canvas') as HTMLCanvasElement;
  previewCanvas = document.getElementById('prompt-preview-canvas') as HTMLCanvasElement;
  ctx = canvas.getContext('2d');
  playerCtx = playerCanvas.getContext('2d');

  resizeCanvas();
  window.addEventListener('resize', debounce(40, resizeCanvas));
}

function resizeCanvas() {
  canvas.height = height;
  canvas.width = width;
  playerCanvas.height = height;
  playerCanvas.width = width;
  previewCanvas.height = height;
  previewCanvas.width = width;
}

function drawAll() {
  const gameState = getGameState();
  if (!gameState) return requestAnimationFrame(drawAll);

  ctx.clearRect(0, 0, width, height);
  drawBackground(gameState);
  drawCursors(gameState);

  requestAnimationFrame(drawAll);
}

function drawBackground(gameState: GameState) {
  if (!gameState.background) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(gameState.background as any, 0, 0);
}

function drawCursors(gameState: GameState) {
  // just draw the current players cursor
  const { x, y } = getMousePos();
  ctx.strokeRect(x - 5, y - 5, 10, 10);
  // gameState.cursors.forEach((c) => {
  //   // if it's the current player then render then where the mouse actually is
  //   // to make it feel less laggy
  //   if (c.username === (window as any).playerName) {
  //     const { x, y } = getMousePos();
  //     ctx.strokeRect(x - 5, y - 5, 10, 10);
  //   } else {
  //     ctx.strokeRect(c.x - 5, c.y - 5, 10, 10);
  //   }
  // });
}

function clearPlayerCanvas() {
  playerCtx.clearRect(0, 0, width, height);
}

function clearBackgroundCanvas() {
  ctx.clearRect(0, 0, width, height);
}

function getCanvas() {
  return canvas;
}
function getPlayerCanvas() {
  return playerCanvas;
}

function startRenderInterval() {
  requestAnimationFrame(drawAll);
}

function stopRenderInterval() {
  clearInterval(renderInterval);
}

function drawPlayer(startX: number, startY: number, endX: number, endY: number) {
  playerCtx.beginPath();
  playerCtx.moveTo(startX, startY);
  playerCtx.lineTo(endX, endY);
  playerCtx.strokeStyle = getCurrentColor() || 'red';
  playerCtx.lineWidth = getCurrentSize() || 5;
  playerCtx.lineCap = 'round';
  playerCtx.stroke();
}

export function writePromptToPreviewCanvas(prompt: string) {
  printPromptToCanvas(prompt, previewCanvas.getContext('2d'), true);
}

export {
  initCanvas,
  getCanvas,
  getPlayerCanvas,
  drawPlayer,
  clearPlayerCanvas,
  clearBackgroundCanvas,
  startRenderInterval,
  stopRenderInterval,
};
