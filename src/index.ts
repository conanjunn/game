import { Math, Vec2 } from 'planck-js';
import { Ground } from './ground';
import { engine } from './engine';
import { Player } from './player';
import { SeedRandom, throttle } from './utils';
import { world } from './world';
import { SendMsg, Socket } from './socket';

const urlQuery: string = location.search.split('?')[1];
const playerId: number = parseInt(urlQuery.split('=')[1], 10);
let player: Player | null = null;

// const ground = new Ground(20, 1, Vec2(25, 25));
if (playerId === 1) {
  player = new Player(playerId, Vec2(30, 10));
}

let groundList: Ground[] = [new Ground(10, 1, Vec2(20, 50))];

if (playerId === 1) {
  const seedRandom = new SeedRandom('abc');
  engine.addTick(
    throttle(2, () => {
      const a = seedRandom.random(0, 40);
      groundList.push(new Ground(10, 1, Vec2(a, 50)));
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
}

const socket = new Socket(playerId);
let another: Player | null = null;
socket.setHandler((e: SendMsg) => {
  if (e.playerId === playerId) {
    return;
  }
  if (!another) {
    another = new Player(e.playerId, e.pos, true);
    return;
  }
  another.body.setPosition(e.pos);
});

if (player) {
  engine.addTick(
    throttle(0.01, () => {
      socket.send({
        playerId,
        pos: <Vec2>player?.body.getPosition(),
      });
    })
  );
}

engine.runner();
