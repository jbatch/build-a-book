type JoinMessage = { username: string };
type DisconnectMessage = {};
type GameStateMessage = {
  t: number;
  serverFps: number;
  cursors: Array<PlayerState>;
  canvasBuffer: string;
};
type InputMessage = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  mouseDown: boolean;
};
type DrawImageMessage = {
  imageData: string; // Data URL of image to append to Canvas
};
type GameOverMessage = {};

type SocketEvents = {
  join: JoinMessage;
  disconnect: DisconnectMessage;
  'game-state': GameStateMessage;
  input: InputMessage;
  'draw-image': DrawImageMessage;
  'game-over': GameOverMessage;
};
