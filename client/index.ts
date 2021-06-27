import { initialiseSocket, safeOn, safeEmit } from './sockets';
import { initCanvas, getCanvas, startRenderInterval } from './canvas';
import { initInputHandlers } from './input';
import { processBackgroundUpdate, processCursorsUpdate, processServerRoomState } from './game-state';
import { initDrawingTools } from './drawing-tools';
import { sendClientJoinMessage } from './network';
import { drawPlayersInLobby, drawPlayersInPrompt, SCREENS, initUi, showScreen } from './ui';

const socket = initialiseSocket();

function init() {
  initUi();
  initCanvas();
  initInputHandlers();
  initDrawingTools();
  startRenderInterval();
  showScreen(SCREENS.HOME);
  drawPlayersInLobby();

  socket.on('connect', () => {
    const playerName = 'Player ' + Math.floor(Math.random() * 100);
    // sendClientJoinMessage(playerName, 'AAAA');
  });
  safeOn('server-room-state', (serverRoomState) => {
    console.log('Got server-room-state', { state: serverRoomState });
    processServerRoomState(serverRoomState);
    if (serverRoomState.status === 'lobby') {
      showScreen(SCREENS.LOBBY);
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
