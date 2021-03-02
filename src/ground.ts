import { Box, Vec2 } from 'planck-js';
import { world } from './world';

export class Ground {
  constructor(hx: number, hy: number, center: Vec2) {
    world.createBody().createFixture(Box(hx, hy, center), {
      friction: 0,
    });
  }
}
