import { SCREENS } from './ui';
export type GameState = {
  currentScreen: SCREENS;
  players: Array<PlayerState>;
  prompts: Array<Prompt>;
  cursors: Array<PlayerState>;
  background: HTMLImageElement;
  oldBackgroundString: string;
  currentPrompt: Prompt;
  timeRemaining: number;
  dirty: boolean;
};
let gameState: GameState = {
  currentScreen: SCREENS.HOME,
  players: [],
  prompts: [],
  cursors: [],
  background: null,
  oldBackgroundString: '',
  timeRemaining: 0,
  currentPrompt: null,
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

  if (roomState.prompts) gameState.prompts = roomState.prompts;
  if (roomState.currentPrompt) gameState.currentPrompt = roomState.currentPrompt;
  if (roomState.timeRemaining) gameState.timeRemaining = roomState.timeRemaining;

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
