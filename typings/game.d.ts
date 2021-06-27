type PlayerState = {
  id: string;
  username: string;
  color: string;
  x?: number;
  y?: number;
  actionPending: boolean; // Whether we're waiting for them to submit/vote
};

type CollectableState = {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
};

type Prompt = {
  userId: string;
  prompt: string;
  votes: number;
};

type BookPage = {
  prompt: Prompt;
  imgStr: string;
};

type RoomStatus = ServerRoomState['status'];

type GameSettings = {
  drawingTime: number;
  pages: number;
};
