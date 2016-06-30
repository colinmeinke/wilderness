import { shape, render, play } from '../../src';

const animation = shape(
  { selector: '.positionA' },
  { selector: '.positionB', duration: 800, reverse: true },
  { selector: '.positionC', duration: 1200, reverse: true, moveIndex: 2 },
  { selector: '.positionD', duration: 2000, reverse: true, easing: 'easeOutElastic' },
  { selector: '.positionA', duration: 3000, easing: 'easeInElastic' }
);

render({ selector: '.svg' }, animation );

play( animation, {
  alternate: true,
  iterations: Infinity,
});
