let gameState: GameStateMessage;

function getGameState(): GameStateMessage {
  return gameState;
}

function processGameStateUpdate(newState: GameStateMessage) {
  gameState = newState;
  return gameState;
}

export { getGameState, processGameStateUpdate };
