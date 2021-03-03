import { Body, Box, Vec2 } from 'planck-js';
import { world } from './world';

export class Ground {
  constructor(hx: number, hy: number, center: Vec2) {
    this.body = world.createBody();
    this.body.createFixture(Box(hx, hy, center), {
      friction: 0,
    });
  }
  readonly body: Body;
}
