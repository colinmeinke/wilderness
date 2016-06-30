const animationDefaults = {
  delay: 0,
  duration: 250,
};

const animationProps = [
  'delay',
  'duration',
  'easing',
  'finish',
  'motionPath',
  'name',
  'start',
];

const manipulationProps = [
  'moveIndex',
  'offset',
  'reverse',
  'scale',
];

const shapeProps = [
  'cx',
  'cy',
  'd',
  'height',
  'points',
  'r',
  'rx',
  'ry',
  'shapes',
  'type',
  'width',
  'x',
  'x1',
  'x2',
  'y',
  'y1',
  'y2',
];

const stylePropAttrMap = {
  fill: 'fill',
  fillOpactity: 'fill-opacity',
  fillRule: 'fill-rule',
  stroke: 'stroke',
  strokeDasharray: 'stroke-dasharray',
  strokeDashoffset: 'stroke-dashoffset',
  strokeLinecap: 'stroke-linecap',
  strokeLinejoin: 'stroke-linejoin',
  strokeOpactity: 'stroke-opacity',
  strokeWidth: 'stroke-width',
  vectorEffect: 'vector-effect',
};

const styleProps = Object.keys( stylePropAttrMap );

export {
  animationDefaults,
  animationProps,
  manipulationProps,
  shapeProps,
  stylePropAttrMap,
  styleProps,
};
