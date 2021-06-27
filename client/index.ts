import { initialiseSocket, safeOn, safeEmit } from './sockets';
import { initCanvas, getCanvas, startRenderInterval } from './canvas';
import { initInputHandlers } from './input';
import { processBackgroundUpdate, processCursorsUpdate, processServerRoomState } from './game-state';
import { initDrawingTools } from './drawing-tools';
import { drawPlayersInLobby, SCREENS, showScreen } from './ui';

const socket = initialiseSocket();

function init() {
  initCanvas();
  initInputHandlers();
  initDrawingTools();
  startRenderInterval();
  showScreen(SCREENS.GAME);
  drawPlayersInLobby();

  socket.on('connect', () => {
    const playerName = 'Player ' + Math.floor(Math.random() * 100);
    safeEmit('client-join', { username: playerName, room: 'AAAA' });
  });
  safeOn('server-room-state', (serverRoomState) => {
    processServerRoomState(serverRoomState);
    if (serverRoomState.status === 'lobby') {
      drawPlayersInLobby();
    }
  });
  safeOn('server-update-cursors', (serverUpdateCursors) => {
    processCursorsUpdate(serverUpdateCursors.cursors);
  });
  safeOn('server-update-background', (serverUpdateBackground) => {
    processBackgroundUpdate(serverUpdateBackground.backgroundImage);
  });
  safeOn('server-welcome', (serverWelcome) => {
    console.log('Server Welcome: ', { serverWelcome });
    (window as any).player = { id: serverWelcome.id, color: serverWelcome.color };
    processBackgroundUpdate(serverWelcome.backgroundImage);
  });
}

document.addEventListener('DOMContentLoaded', init);
