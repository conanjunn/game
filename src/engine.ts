import { DebugDraw } from './debugDraw';
import { world } from './world';

type tick = { (deltaTime: number): void };

export class Engine {
  constructor() {}
  private ticks: tick[] = [];
  private prevTime: number = 0;
  runner() {
    requestAnimationFrame((time: number) => {
      const deltaTime = (time - this.prevTime) / 1000;
      this.ticks.forEach((item: tick) => {
        item(deltaTime);
      });

      world.step(deltaTime, 8, 3);

      world.ctx.clearRect(0, 0, world.canvas.width, world.canvas.height);
      new DebugDraw();

      this.prevTime = time;

      this.runner();
    });
  }
  addTick(handler: tick) {
    this.ticks.push(handler);
  }
  removeTick(handler: tick) {
    this.ticks = this.ticks.filter((item: tick) => {
      return item !== handler;
    });
  }
}

export const engine = new Engine();
