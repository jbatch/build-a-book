import { initialiseSocket, safeOn, safeEmit } from './sockets';
import { initCanvas, getCanvas } from './canvas';
import { initInputHandlers } from './input';

const socket = initialiseSocket();

function init() {
  initCanvas();
  initInputHandlers();

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
