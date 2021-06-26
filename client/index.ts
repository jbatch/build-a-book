import { initialiseSocket, safeOn, safeEmit } from './sockets';
import { initCanvas } from './canvas';

const socket = initialiseSocket();

function init() {
  initCanvas();

  socket.on('connect', () => {
    safeEmit('join', { username: 'foo' });
  });
  safeOn('disconnect', () => {});
  safeOn('game-state', (gameState) => {
    console.log({ gameState });
  });
  safeOn('game-over', () => {});
}

document.addEventListener('DOMContentLoaded', init);
