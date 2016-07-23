import { shape, render, play } from './tmp';
import { add } from 'points';

let animation;
let points;

const form = document.querySelector( '.form' );
const moveIndex = form.querySelector( 'input[name="moveIndex"]' );
const reverse = form.querySelector( 'input[name="reverse"]' );

const sharedProperties = {
  fill: 'none',
  stroke: '#333',
  strokeWidth: 2,
};

const from = {
  ...sharedProperties,
  type: 'path',
  d: 'M 159.000,189.000L194.267,207.541L187.532,168.271L216.063,140.459L176.634,134.729L159.000,99.000L141.366,134.729L101.937,140.459L130.468,168.271L123.733,207.541L159.000,189.000',
};

const to = {
  ...sharedProperties,
  type: 'rect',
  width: 400,
  height: 300,
  x: 200,
  y: 150,
};

const settings = {
  alternate: true,
  duration: 2000,
  iterations: Infinity,
};

const createAnimation = ( moveIndex = 0, reverse = false ) => {
  animation = shape({ ...from, moveIndex, reverse }, { ...to });

  const [ pointsFrom, pointsTo ] = animation.timeline.keyframes.map(({ shapes }) => (
    add( shapes[ 0 ].points, 11 ).map(({ x, y }, i ) => ({
      type: 'circle',
      r: 10,
      cx: x,
      cy: y,
      fill: i === 0 ? '#E54' : '#444',
    })).slice( 0, -1 )
  ));

  points = shape({ type: 'g', shapes: pointsFrom }, { type: 'g', shapes: pointsTo });

  render({ selector: '.svg' }, animation, points );
};

const playAnimation = () => {
  play( animation, settings );
  play( points, settings );
};

const removeAnimation = () => {
  animation.nodes.map( n => {
    n.remove();
  });

  points.nodes.map( n => {
    n.remove();
  });

  animation = undefined;
  points = undefined;
};

const run = () => {
  createAnimation(
    parseInt( moveIndex.value, 10 ),
    reverse.checked
  );

  playAnimation( animation );
};

moveIndex.addEventListener( 'change', () => {
  removeAnimation();
  run();
});

reverse.addEventListener( 'change', () => {
  removeAnimation();
  run();
});

run();
