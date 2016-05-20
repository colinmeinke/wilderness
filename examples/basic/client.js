import { shape, render } from '../../src';

const circle = shape({
  type: 'circle',
  cx: 50,
  cy: 50,
  r: 25,
  fill: '#E54',
});

render({ selector: '.svg' }, circle );
