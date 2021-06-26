let gameState: GameStateMessage;

function getGameState(): GameStateMessage {
  return gameState;
}

function processGameStateUpdate(newState: GameStateMessage) {
  gameState = newState;
  return gameState;
}

function getPlayerColor() {
  const gameState = getGameState();
  const playerName = (window as any).playerName;
  return gameState?.cursors.find((c) => c.username === playerName)?.color || 'red';
}

export { getGameState, processGameStateUpdate, getPlayerColor };
