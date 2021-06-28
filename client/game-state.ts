import { SCREENS } from './ui';
export type GameState = {
  currentScreen: SCREENS;
  gameSettings: GameSettings;
  players: Array<PlayerState>;
  prompts: Array<Prompt>;
  bookPages: Array<BookPage>;
  cursors: Array<PlayerState>;
  background: HTMLImageElement;
  oldBackgroundString: string;
  currentPrompt: Prompt;
  currentPage: number;
  timeRemaining: number;
  dirty: boolean;
};
let gameState: GameState = {
  currentScreen: SCREENS.HOME,
  gameSettings: { drawingTime: 60, pages: 5, fontColor: '#00ff00', backgroundColor: '#ffffff' },
  players: [],
  prompts: [],
  cursors: [],
  bookPages: [],
  background: null,
  oldBackgroundString: '',
  timeRemaining: 0,
  currentPrompt: null,
  currentPage: 0,
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
  gameState.gameSettings = roomState.gameSettings;
  gameState.currentPage = roomState.page;
  if (roomState.prompts) {
    gameState.prompts = roomState.prompts;
  }

  if (roomState.prompts) gameState.prompts = roomState.prompts;
  if (roomState.currentPrompt) gameState.currentPrompt = roomState.currentPrompt;
  if (roomState.timeRemaining) gameState.timeRemaining = roomState.timeRemaining;
  if (roomState.bookPages) gameState.bookPages = roomState.bookPages;

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
      gameState.currentScreen = SCREENS.END;
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

function clearCanvasState() {
  gameState.background = null;
  gameState.oldBackgroundString = '';
}

export { getGameState, clearCanvasState, processServerRoomState, processCursorsUpdate, processBackgroundUpdate };
