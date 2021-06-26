export type GameState = {
  cursors: Array<any>;
  background: HTMLImageElement;
  oldBackgroundString: string;
  dirty: boolean;
};
let gameState: GameState = {
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

function processCursorsUpdate(cursors: Array<any>) {
  gameState.cursors = cursors;
}

function setBackgroundDirty(dirty: boolean) {
  gameState.dirty = dirty;
}

export { getGameState, processCursorsUpdate, processBackgroundUpdate };
