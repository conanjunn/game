import { Vec2, World as plWorld } from 'planck-js';

export class World extends plWorld {
  constructor() {
    super({
      gravity: Vec2(0, 10),
    });
  }
  readonly canvas: HTMLCanvasElement = <HTMLCanvasElement>(
    document.getElementById('canvas')
  );
  readonly ctx: CanvasRenderingContext2D = <CanvasRenderingContext2D>(
    this.canvas.getContext('2d')
  );
  readonly scale: number = 10;
}

export const world = new World();
