import { shape, render, play } from '../../src';

const positionA = {
  type: 'g',
  strokeWidth: 2,
  stroke: '#000',
  shapes: [
    {
      type: 'circle',
      cx: 10,
      cy: 20,
      r: 10,
      fill: '#E54',
    },
    {
      type: 'circle',
      cx: 15,
      cy: 50,
      r: 10,
      fill: '#E65',
    },
    {
      type: 'circle',
      cx: 20,
      cy: 80,
      r: 10,
      fill: '#E76',
    },
  ],
};

const positionB = {
  stroke: '#555',
  strokeWidth: 5,
  shapes: [{ cx: 90 }, { cx: 85 }, { cx: 80 }],
};

const animation = shape( positionA, positionB );

render({ selector: '.svg' }, animation );

play( animation, {
  alternate: true,
  duration: 2000,
  iterations: Infinity,
});
