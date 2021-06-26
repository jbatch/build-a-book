type JoinMessage = { username: string };
type DisconnectMessage = {};
type GameStateMessage = {
  t: number;
  serverFps: number;
  cursors: Array<PlayerState>;
  canvasBuffer: Buffer;
};
type InputMessage = {
  x: number;
  y: number;
};
type GameOverMessage = {};

type SocketEvents = {
  join: JoinMessage;
  disconnect: DisconnectMessage;
  'game-state': GameStateMessage;
  input: InputMessage;
  'game-over': GameOverMessage;
};
