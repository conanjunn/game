import { Vec2 } from 'planck-js';
import { Ground } from './ground';
import { engine } from './engine';
import { Player } from './player';

new Ground(20, 1, Vec2(25, 25));
new Player(Vec2(30, 10));

engine.runner();
