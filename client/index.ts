import { initialiseSocket, safeOn, safeEmit } from './sockets';
import { initCanvas, getCanvas, startRenderInterval } from './canvas';
import { initInputHandlers } from './input';
import { processGameStateUpdate } from './game-state';

const socket = initialiseSocket();

function init() {
  initCanvas();
  initInputHandlers();
  startRenderInterval();

  socket.on('connect', () => {
    safeEmit('join', { username: 'foo' });
  });
  safeOn('disconnect', () => {});
  safeOn('game-state', (gameState) => {
    console.log({ gameState });
    // console.log({ gameState });
    processGameStateUpdate(gameState);
  });
  safeOn('game-over', () => {});
}

document.addEventListener('DOMContentLoaded', init);
