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
};
