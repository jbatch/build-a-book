export default class Player {
  id: string;
  username: string;
  color: string;
  x: number;
  y: number;
  constructor(id: string, username: string, color: string, x: number, y: number) {
    this.id = id;
    this.username = username;
    this.color = color;
    this.x;
    this.y;
  }

  update(dt: number) {}

  serializeForUpdate(): PlayerState {
    return {
      id: this.id,
      username: this.username,
      color: this.color,
      x: this.x,
      y: this.y,
    };
  }
}
