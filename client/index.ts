import { clearBackgroundCanvas, clearPlayerCanvas, initCanvas, startRenderInterval } from './canvas';
import { initDrawingTools } from './drawing-tools';
import { createBookGif } from './export';
import {
  clearCanvasState,
  getGameState,
  processBackgroundUpdate,
  processCursorsUpdate,
  processServerRoomState,
} from './game-state';
import { initInputHandlers } from './input';
import { sendClientJoinMessage } from './network';
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
  updateTimerInDrawing,
  drawUpdatedSettings,
  addSettingsUpdatedHandlers,
  drawPageNumberInSubmittingPrompts,
  addCopyInviteLinkHandlers,
  setSubmitEnabledSubmittingPrompts,
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
    const changedScreen = previousScreen !== gameState.currentScreen && gameState.currentScreen !== SCREENS.HOME;
    // Only call showScreen if the screen has changed from the previous state
    if (changedScreen) {
      showScreen(gameState.currentScreen);
      console.log('Changed Screen: ', previousScreen, gameState.currentScreen);
    }

    if (serverRoomState.status === 'lobby') {
      drawPlayersInLobby();
      drawUpdatedSettings();
      if (changedScreen) {
        addCopyInviteLinkHandlers(serverRoomState.room);
        addSettingsUpdatedHandlers();
      }
    } else if (serverRoomState.status === 'submitting-prompts') {
      drawPlayersInPrompt();
      setSubmitEnabledSubmittingPrompts();
      if (changedScreen) {
        drawPageNumberInSubmittingPrompts();
      }
    } else if (serverRoomState.status === 'voting') {
      drawPlayersInVoting();
      if (changedScreen) {
        drawPromptsInVoting();
        addVotingEventHandlers();
      }
    } else if (serverRoomState.status === 'drawing') {
      addPromptToDrawing();
      updateTimerInDrawing();
      if (changedScreen) {
        clearCanvasState();
        clearPlayerCanvas();
        clearBackgroundCanvas();
      }
    } else if (serverRoomState.status === 'end') {
      createBookGif();
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
