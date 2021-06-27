import { initCanvas, startRenderInterval } from './canvas';
import { initDrawingTools } from './drawing-tools';
import { getGameState, processBackgroundUpdate, processCursorsUpdate, processServerRoomState } from './game-state';
import { initInputHandlers } from './input';
import { initialiseSocket, safeOn } from './sockets';
import {
  drawPlayersInLobby,
  drawPlayersInPrompt,
  drawPromptsInVoting,
  initUi,
  SCREENS,
  showScreen,
  drawPlayersInVoting,
  addVotingEventHandlers,
  addPromptToDrawing,
} from './ui';

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
    } else if (serverRoomState.status === 'submitting-prompts') {
      drawPlayersInPrompt();
    } else if (serverRoomState.status === 'voting') {
      drawPlayersInVoting();
      drawPromptsInVoting();
      addVotingEventHandlers();
    } else if (serverRoomState.status === 'drawing') {
      addPromptToDrawing();
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
