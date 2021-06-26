import { debounce } from 'throttle-debounce';

import { GameState, getGameState } from './game-state';

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
}

function drawAll() {
  const gameState = getGameState();
  if (!gameState) return requestAnimationFrame(drawAll);

  drawBackground(gameState);
  drawCursors(gameState);
}

function drawBackground(gameState: GameState) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(gameState.background, 0, 0);
}


function drawCursors(gameState: GameState) {
  gameState.cursors.forEach((c) => {
    if (c.username === (window as any).playerName) {
      ctx.rect(c.x, c.y, 10, 10);
    } else {
      ctx.rect(c.x, c.y, 10, 10);
    }
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
  console.log('starting');
  requestAnimationFrame(drawAll);
}

function stopRenderInterval() {
  clearInterval(renderInterval);
}

function drawPlayer(startX: number, startY: number, endX: number, endY: number) {
  playerCtx.beginPath();
  playerCtx.moveTo(startX, startY);
  playerCtx.lineTo(endX, endY);
  playerCtx.strokeStyle = (window as any).player?.color || 'red';
  playerCtx.lineWidth = 5;
  playerCtx.lineCap = 'round';
  playerCtx.stroke();
}

export {
  initCanvas,
  getCanvas,
  getPlayerCanvas,
  drawPlayer,
  clearPlayerCanvas,
  startRenderInterval,
  stopRenderInterval,
};
