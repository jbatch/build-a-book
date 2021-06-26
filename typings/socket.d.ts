// Client
type ClientJoin = { username: string };
type ClientDisconnect = {};
type ClientLocation = {
  endX: number;
  endY: number;
};
type ClientDraw = {
  imageData: string; // Data URL of image to append to Canvas
};

// Server
type ServerWelcome = {
  id: string;
  color: string;
  backgroundImage: string; // Data URL of starting image
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
  disconnect: ClientDisconnect;
  'client-location': ClientLocation;
  'client-draw': ClientDraw;
  // Sent by Server
  'server-welcome': ServerWelcome;
  'server-update-cursors': ServerUpdateCursors;
  'server-update-background': ServerUpdateBackground;
};
