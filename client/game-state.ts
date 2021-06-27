import { SCREENS } from './ui';
export type GameState = {
  currentScreen: SCREENS;
  players: Array<PlayerState>;
  cursors: Array<PlayerState>;
  background: HTMLImageElement;
  oldBackgroundString: string;
  dirty: boolean;
};
let gameState: GameState = {
  currentScreen: SCREENS.HOME,
  players: [],
  cursors: [],
  background: null,
  oldBackgroundString: '',
  dirty: false,
};

function getGameState() {
  return gameState;
}

function processBackgroundUpdate(backgroundStr: string) {
  if (backgroundStr !== gameState.oldBackgroundString) {
    const img = new Image();
    img.onload = () => {
      gameState.background = img;
      gameState.dirty = true;
      gameState.oldBackgroundString = backgroundStr;
    };
    img.src = backgroundStr;
  }
}

function processServerRoomState(roomState: ServerRoomState) {
  gameState.players = roomState.players;
  switch (roomState.status) {
    case 'lobby':
      gameState.currentScreen = SCREENS.LOBBY;
      break;
    case 'submitting-prompts':
      gameState.currentScreen = SCREENS.PROMPTS;
      break;
    case 'voting':
      gameState.currentScreen = SCREENS.VOTING;
      break;
    case 'drawing':
      gameState.currentScreen = SCREENS.GAME;
      break;
    case 'end':
      gameState.currentScreen = SCREENS.LOBBY;
      break;
    default:
      break;
  }
}

function processCursorsUpdate(cursors: Array<any>) {
  gameState.cursors = cursors;
}

function setBackgroundDirty(dirty: boolean) {
  gameState.dirty = dirty;
}

export { getGameState, processServerRoomState, processCursorsUpdate, processBackgroundUpdate };
