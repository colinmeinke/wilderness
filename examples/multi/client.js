import { shape, render, play } from './tmp';

const animation = shape(
  { selector: '.positionA' },
  { selector: '.positionB', duration: 800 },
  { selector: '.positionC', duration: 1200 },
  { selector: '.positionD', duration: 2000, easing: 'easeOutElastic' },
  { selector: '.positionA', duration: 3000, easing: 'easeInElastic' }
);

render({ selector: '.svg' }, animation );

play( animation, {
  alternate: true,
  iterations: Infinity,
});
