import { Vec2 } from 'planck-js';
import { Ground } from './ground';
import { world } from './world';
import { Engine } from './engine';

new Ground(20, 1, Vec2(25, 25));

new Engine();
