import { Vec2, Body, Circle, Box } from 'planck-js';
import { engine } from './engine';
import { keyboard } from './keyboard';
import { world } from './world';

export class Player {
  readonly radius: number = 1;
  readonly body: Body;
  readonly center: Readonly<Vec2>;
  readonly acceleration: Readonly<Vec2> = Vec2(10, 0);
  readonly id: number;

  constructor(id: number, center: Vec2, isAnother = false) {
    this.id = id;
    this.center = center;
    this.body = world.createDynamicBody({
      fixedRotation: true,
      position: this.center,
      allowSleep: true,
      angularDamping: 0,
      linearDamping: 0,
      gravityScale: isAnother ? 0 : 1,
    });
    this.body.createFixture(Circle(Vec2(0, 0), this.radius), {
      friction: 0,
      density: 10,
    });
    this.body.createFixture(Circle(Vec2(1, 0), this.radius), {
      friction: 0,
    });
    this.body.createFixture(Box(0.5, 0.5, Vec2(0.5, 1.5)), {
      friction: 0,
      density: 10,
    });

    if (!isAnother) {
      this.event();
    }
  }
  goLeft(deltaTime: number) {
    const speed = this.body.getLinearVelocity();
    if (speed.x <= -10) {
      this.body.setLinearVelocity(Vec2(-10, speed.y));
      return;
    }
    if (speed.x > 0) {
      this.body.setLinearVelocity(
        Vec2.sub(speed, Vec2(deltaTime * this.acceleration.x * 3, 0))
      );
      return;
    }
    this.body.setLinearVelocity(
      Vec2.sub(speed, Vec2(deltaTime * this.acceleration.x, 0))
    );
  }
  stopLeft(deltaTime: number) {
    const speed = this.body.getLinearVelocity();
    if (speed.x >= 0) {
      this.body.setLinearVelocity(Vec2(0, speed.y));
      return;
    }
    this.body.setLinearVelocity(
      Vec2.add(speed, Vec2(deltaTime * this.acceleration.x * 2, 0))
    );
  }
  goRight(deltaTime: number) {
    const speed = this.body.getLinearVelocity();
    if (speed.x >= 10) {
      this.body.setLinearVelocity(Vec2(10, speed.y));
      return;
    }
    if (speed.x < 0) {
      this.body.setLinearVelocity(
        Vec2.add(speed, Vec2(deltaTime * this.acceleration.x * 3, 0))
      );
      return;
    }
    this.body.setLinearVelocity(
      Vec2.add(speed, Vec2(deltaTime * this.acceleration.x, 0))
    );
  }
  stopRight(deltaTime: number) {
    const speed = this.body.getLinearVelocity();
    if (speed.x <= 0) {
      this.body.setLinearVelocity(Vec2(0, speed.y));
      return;
    }
    this.body.setLinearVelocity(
      Vec2.sub(speed, Vec2(deltaTime * this.acceleration.x * 2, 0))
    );
  }
  private event() {
    const goLeft = this.goLeft.bind(this);
    const stopLeft = this.stopLeft.bind(this);
    const stopRight = this.stopRight.bind(this);
    const goRight = this.goRight.bind(this);
    const keydownList = keyboard.getKeydownList();
    keyboard.addKeydownOnceEvent(37, () => {
      engine.removeTick(goRight);
      engine.removeTick(stopLeft);
      engine.removeTick(stopRight);
      engine.addTick(goLeft);
    });
    keyboard.addKeyupEvent(37, () => {
      engine.removeTick(goLeft);
      if (!keydownList[39]) {
        engine.addTick(stopLeft);
      }
    });
    keyboard.addKeydownOnceEvent(39, () => {
      engine.removeTick(stopLeft);
      engine.removeTick(stopRight);
      engine.removeTick(goLeft);
      engine.addTick(goRight);
    });
    keyboard.addKeyupEvent(39, () => {
      engine.removeTick(goRight);
      if (!keydownList[37]) {
        engine.addTick(stopRight);
      }
    });
  }
}
