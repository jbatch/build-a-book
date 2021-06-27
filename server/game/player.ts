export default class Player {
  id: string;
  username: string;
  color: string;
  x: number;
  y: number;
  actionPending: boolean;
  constructor(id: string, username: string, color: string, x: number, y: number) {
    this.id = id;
    this.username = username;
    this.color = color;
    this.x;
    this.y;
    this.actionPending = false;
  }

  update(dt: number) {}

  serializeForUpdate(): PlayerState {
    return {
      id: this.id,
      username: this.username,
      color: this.color,
      x: this.x,
      y: this.y,
      actionPending: this.actionPending,
    };
  }
}
