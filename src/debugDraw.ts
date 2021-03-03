import { Fixture, Polygon, Shape } from 'planck-js';
import { iterate } from './utils';
import { world } from './world';
import { Body, Circle, Vec2 } from 'planck-js';

export class DebugDraw {
  constructor() {
    world.ctx.lineWidth = 1;
    world.ctx.strokeStyle = '#FF0000';
    iterate<Body>(world.getBodyList(), (body) => {
      const pos: Vec2 = body.getPosition();
      iterate<Fixture>(body.getFixtureList(), (fixture) => {
        const shape: Shape = fixture.getShape();
        switch (shape.getType()) {
          case 'circle':
            this.circle(shape, pos);
            break;
          case 'polygon':
            this.polygon(shape, pos);
            break;
          default:
            console.error('debugDraw: unknown shape type', shape);
            break;
        }
      });
    });
  }
  private circle(shape: Shape, pos: Vec2) {
    const circle: Circle = <Circle>shape;
    const center: Vec2 = Vec2.add(circle.getCenter(), pos);

    world.ctx.beginPath();
    world.ctx.arc(
      center.x * world.scale,
      center.y * world.scale,
      circle.getRadius() * world.scale,
      0,
      2 * Math.PI
    );
    world.ctx.stroke();
  }
  private polygon(shape: Shape, pos: Vec2) {
    const polygon: Polygon = <Polygon>shape;
    world.ctx.beginPath();
    polygon.m_vertices.forEach((item, index: number) => {
      const point = Vec2.add(item, pos);
      if (index === 0) {
        world.ctx.moveTo(point.x * world.scale, point.y * world.scale);
        return;
      }
      world.ctx.lineTo(point.x * world.scale, point.y * world.scale);
    });
    world.ctx.closePath();
    world.ctx.stroke();
  }
}
