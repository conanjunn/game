import { DebugDraw } from './debugDraw';
import { world } from './world';

export class Engine {
  constructor() {
    this.runner();
  }
  private prevTime: number = 0;
  private runner() {
    requestAnimationFrame((time: number) => {
      world.step((time - this.prevTime) / 1000, 8, 3);

      world.ctx.clearRect(0, 0, world.canvas.width, world.canvas.height);

      new DebugDraw();

      this.prevTime = time;
      this.runner();
    });
  }
}
