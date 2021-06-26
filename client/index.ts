import { initialiseSocket, safeOn, safeEmit } from './sockets';
import { initCanvas } from './canvas';

const socket = initialiseSocket();

function init() {
  initCanvas();

  socket.on('connect', () => {});
  safeOn('disconnect', () => {});
  safeOn('game-state', (gameState) => {});
  safeOn('game-over', () => {});
}

document.addEventListener('DOMContentLoaded', init);
