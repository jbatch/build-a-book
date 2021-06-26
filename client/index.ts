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
    const playerName = 'Player ' + Math.floor(Math.random() * 10);

    (window as any).playerName = playerName;
    safeEmit('join', { username: playerName });
  });
  safeOn('disconnect', () => {});
  safeOn('game-state', (gameState) => {
    // console.log({ gameState });
    // console.log({ gameState });
    processGameStateUpdate(gameState);
  });
  safeOn('game-over', () => {});
}

document.addEventListener('DOMContentLoaded', init);
