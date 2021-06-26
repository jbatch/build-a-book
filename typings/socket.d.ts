type JoinMessage = { username: string };
type DisconnectMessage = {};
type GameStateMessage = {
  t: number;
  serverFps: number;
  cursors: Array<PlayerState>;
  canvasBuffer: Uint8ClampedArray;
};
type InputMessage = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  mouseDown: boolean;
};
type GameOverMessage = {};

type SocketEvents = {
  join: JoinMessage;
  disconnect: DisconnectMessage;
  'game-state': GameStateMessage;
  input: InputMessage;
  'game-over': GameOverMessage;
};
