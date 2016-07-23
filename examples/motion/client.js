import { shape, render, play } from './tmp';

const circle = { type: 'circle', cx: 50, cy: 10, r: 10 };
const positionA = { ...circle, fill: '#E54' };
const positionB = { ...circle, fill: '#0FA', scale: 0.5 };

const motionPath = {
  type: 'path',
  d: 'M0,0l40,80h-80l20,-40h60l-40,40l-40,-40q0-20,20-20m30,0h30',
  easing: 'easeInOutElastic',
};

const motionPathStroke = shape({
  ...motionPath,
  offset: [ circle.cx, circle.cy ],
  fill: 'none',
  stroke: '#EEE',
});

const animation = shape( positionA, { ...positionB, motionPath });

render({ selector: '.svg' }, motionPathStroke, animation );

play( animation, {
  alternate: true,
  duration: 4000,
  iterations: Infinity,
});
