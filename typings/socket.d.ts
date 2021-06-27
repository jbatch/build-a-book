// Client
type ClientJoin = { username: string; room: string };
type ClientHostUpdateSettings = {};
type ClientHostStart = {};
type ClientSubmitPrompt = { prompt: string };
type ClientVotePrompt = { userId: string }; // UserId of the user that submitted the prompt
type ClientDisconnect = {};
type ClientLocation = {
  endX: number;
  endY: number;
};
type ClientDraw = {
  imageData: string; // Data URL of image to append to Canvas
};
type ClientCanvasReset = {};

// Server
type ServerWelcome = {
  id: string;
  color: string;
  backgroundImage: string; // Data URL of starting image
};
type ServerRoomState = {
  room: string;
  players: Array<PlayerState>;
  page: number;
  status: 'lobby' | 'submitting-prompts' | 'voting' | 'drawing' | 'end';
  prompts?: Array<Prompt>;
  currentPrompt?: Prompt;
  timeRemaining?: number;
};
type ServerUpdateCursors = {
  t: number;
  serverFps: number;
  cursors: Array<PlayerState>;
};
type ServerUpdateBackground = {
  backgroundImage: string; // Data URL of the new background for clients
};

type SocketEvents = {
  // Sent by client
  'client-join': ClientJoin;
  'client-host-settings-update': ClientHostUpdateSettings;
  'client-host-start': ClientHostStart;
  'client-submit-prompt': ClientSubmitPrompt;
  'client-vote-prompt': ClientVotePrompt;
  disconnect: ClientDisconnect;
  'client-location': ClientLocation;
  'client-draw': ClientDraw;
  'client-canvas-reset': ClientCanvasReset;
  // Sent by Server
  'server-welcome': ServerWelcome;
  'server-room-state': ServerRoomState;
  'server-update-cursors': ServerUpdateCursors;
  'server-update-background': ServerUpdateBackground;
};
