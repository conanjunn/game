import { Math, Vec2 } from 'planck-js';
import { Ground } from './ground';
import { engine } from './engine';
import { Player } from './player';
import { throttle } from './utils';
import { world } from './world';

// const ground = new Ground(20, 1, Vec2(25, 25));
new Player(Vec2(30, 10));

let groundList: Ground[] = [new Ground(10, 1, Vec2(20, 50))];

const addGround = throttle(2, () => {
  const a = Math.random(0, 40);
  groundList.push(new Ground(10, 1, Vec2(a, 50)));
  console.log(groundList.length);
});

engine.addTick(addGround);
engine.addTick(() => {
  const arr: number[] = [];
  groundList.forEach((ground, index) => {
    const pos: Vec2 = ground.body.getPosition();
    if (pos.y < -55) {
      arr.push(index);
    }
    ground.body.setPosition(Vec2.sub(pos, Vec2(0, 0.1)));
  });
  groundList = groundList.filter((item, index) => {
    if (arr.indexOf(index) === -1) {
      return true;
    }
    world.destroyBody(groundList[index].body);
    return false;
  });
});

engine.runner();
