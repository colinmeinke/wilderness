import { shape, render } from '../../src';

const circle = shape({
  type: 'circle',
  cx: 100,
  cy: 150,
  r: 25,
  fill: '#E54',
});

render({ selector: '.svg' }, circle );
