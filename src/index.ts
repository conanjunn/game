import { Math, Vec2 } from 'planck-js';
import { Ground } from './ground';
import { engine } from './engine';
import { Player } from './player';
import { throttle } from './utils';
import { world } from './world';

// const ground = new Ground(20, 1, Vec2(25, 25));
const player = new Player(Vec2(30, 10));

let groundList: Ground[] = [new Ground(10, 1, Vec2(20, 50))];

engine.addTick(
  throttle(2, () => {
    const a = Math.random(0, 40);
    groundList.push(new Ground(10, 1, Vec2(a, 50)));
    console.log(groundList.length);
  })
);
engine.addTick(() => {
  groundList = groundList.filter((ground) => {
    const pos: Vec2 = ground.body.getPosition();
    if (pos.y < -55) {
      world.destroyBody(ground.body);
      return false;
    }
    ground.body.setPosition(Vec2.sub(pos, Vec2(0, 0.1)));
    return true;
  });
});

engine.addTick(() => {
  console.log(player.body.getLinearVelocity());
});

engine.runner();
