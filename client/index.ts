import { initCanvas, startRenderInterval } from './canvas';
import { initDrawingTools } from './drawing-tools';
import { getGameState, processBackgroundUpdate, processCursorsUpdate, processServerRoomState } from './game-state';
import { initInputHandlers } from './input';
import { initialiseSocket, safeOn } from './sockets';
import { sendClientJoinMessage } from './network';
import { drawPlayersInLobby, drawPlayersInPrompt, SCREENS, initUi, showScreen, drawPlayersInVoting } from './ui';

const socket = initialiseSocket();

function init() {
  initUi();
  initCanvas();
  initInputHandlers();
  initDrawingTools();
  startRenderInterval();
  showScreen(SCREENS.HOME);
  drawPlayersInLobby();

  socket.on('connect', () => {});

  safeOn('server-room-state', (serverRoomState) => {
    console.log('Got server-room-state', { state: serverRoomState });
    const gameState = getGameState();
    const previousScreen = gameState.currentScreen;
    processServerRoomState(serverRoomState);
    // Only call showScreen if the screen has changed from the previous state
    if (previousScreen !== gameState.currentScreen && gameState.currentScreen !== SCREENS.HOME) {
      showScreen(gameState.currentScreen);
    }

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
