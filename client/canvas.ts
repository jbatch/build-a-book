import { debounce } from 'throttle-debounce';

import { getGameState, processGameStateUpdate } from './game-state';

const FPS = 60;
const height = 450;
const width = 800;

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let renderInterval: ReturnType<typeof setInterval>;

let playerCanvas: HTMLCanvasElement;
let playerCtx: CanvasRenderingContext2D;

function initCanvas() {
  canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  ctx = canvas.getContext('2d');
  playerCanvas = document.getElementById('player-canvas') as HTMLCanvasElement;
  playerCtx = playerCanvas.getContext('2d');


  resizeCanvas();
  window.addEventListener('resize', debounce(40, resizeCanvas));
}

function resizeCanvas() {
  canvas.height = height;
  canvas.width = width;
  playerCanvas.height = height;
  playerCanvas.width = width;
  drawAll();
}

function drawAll() {
  const gameState = getGameState();
  if (!gameState) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  drawBuffer(gameState);
  drawCursors(gameState);
  
  ctx.stroke();
}
function drawBuffer(gameState: GameStateMessage) {
  const canvasBuffer = gameState.canvasBuffer;
  const img = new Image();
  img.onload = () => {
    ctx.drawImage(img, 10, 10);
  }
  img.src = canvasBuffer;
}

function drawCursors(gameState: GameStateMessage) {
  gameState.cursors.forEach((c) => {
    ctx.rect(c.x, c.y, 10, 10);
  });
}

function clearPlayerCanvas() {
  playerCtx.clearRect(0, 0, width, height);
}

function getCanvas() {
  return canvas;
}
function getPlayerCanvas() {
  return playerCanvas;
}

function startRenderInterval() {
  renderInterval = setInterval(drawAll, 1000 / FPS);
}

function stopRenderInterval() {
  clearInterval(renderInterval);
}

function drawPlayer(startX: number, startY: number, endX: number, endY: number ) {
  playerCtx.beginPath();
  playerCtx.moveTo(startX, startY);
  playerCtx.lineTo(endX, endY);
  playerCtx.strokeStyle = 'green';
  playerCtx.lineWidth = 5;
  playerCtx.lineCap = 'round';
  playerCtx.stroke();
}

export { initCanvas, getCanvas,getPlayerCanvas, drawPlayer,clearPlayerCanvas, startRenderInterval, stopRenderInterval };

