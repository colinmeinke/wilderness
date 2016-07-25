# Wilderness

A Javascript API for building and animating SVG.

**Only 12kb gzipped.**

Currently in development. It's almost there! Please have
a play and let me know if anything isn't working.

The only outstanding task from the API below is to build the
[`timeline()` function](#timeline-function).

## Features

- [Morph a shape](#morph-a-shape)
- [Overlap multiple animations on a timeline](#overlap-multiple-animations-on-a-timeline)
- [Powerful playback controls](#play-function)
- [Animate along a motion path](#animate-along-a-motion-path)
- [React integration](https://github.com/colinmeinke/wilderness-react)

## Installation

```
npm install --save wilderness
```

## Usage

### Create a shape

```js
import { shape, render } from 'wilderness';

const circle = shape({
  type: 'circle',
  cx: 100,
  cy: 150,
  r: 25,
  fill: '#E54',
});

render({ selector: '.svg' }, circle );
```

### Move a shape

```js
import { shape, render, play } from 'wilderness';

const positionA = {
  type: 'circle',
  cx: 100,
  cy: 150,
  r: 25,
  fill: '#E54',
};

const positionB = {
  type: 'circle',
  cx: 50,
  cy: 200,
  r: 25,
  fill: '#E54',
};

const animation = shape( positionA, positionB );

render({ selector: '.svg' }, animation );

play( animation, { duration: 1800 });
```

### Move a shape (some more)

```js
import { shape, render, play } from 'wilderness';

const sharedProperties = {
  type: 'circle',
  r: 25,
  fill: '#E54',
};

const positionA = { ...sharedProperties, cx: 100, cy: 150 };
const positionB = { ...sharedProperties, cx: 50, cy: 200 };
const positionC = { ...sharedProperties, cx: 65, cy: 100 };
const positionD = { ...sharedProperties, cx: 200, cy: 50 };

const animation = shape( positionA, positionB, positionC, positionD );

render({ selector: '.svg' }, animation );

play( animation, { duration: 1800 });
```

### Morph a shape

```js
import { shape, render, play } from 'wilderness';

const triangle = {
  type: 'path',
  d: 'M40,90l30,20h-60z',
  fill: '#E54',
};

const square = {
  type: 'rect',
  x: 400,
  y: 100,
  width: 50,
  height: 50,
  fill: '#0FA',
};

const animation = shape( triangle, square );

render({ selector: '.svg' }, animation );

play( animation, { duration: 1800 });
```

### Sequence multiple animations on a timeline

```js
import { shape, timeline, render, play } from 'wilderness';

const shape1PositionA = { type: 'path', d: '...' };
const shape1PositionB = { type: 'path', d: '...' };

const shape2PositionA = { type: 'path', d: '...' };
const shape2PositionB = { type: 'path', d: '...' };

const shape3PositionA = { type: 'path', d: '...' };
const shape3PositionB = { type: 'path', d: '...' };

const shape1 = shape( shape1PositionA, shape1PositionB );
const shape2 = shape( shape2PositionA, shape2PositionB );
const shape3 = shape( shape3PositionA, shape3PositionB );

const animation = timeline( shape1, shape2, shape3 );

render({ selector: '.svg' }, animation );

play( animation, { duration: 1800 });
```

Timeline:

```
shape1 A----B
shape2       A----B
shape3             A----B
```

### Overlap multiple animations on a timeline

```js
import { shape, timeline, render, play } from 'wilderness';

const shape1PositionA = { type: 'path', d: '...' };
const shape1PositionB = { type: 'path', d: '...' };

const shape2PositionA = { type: 'path', d: '...' };
const shape2PositionB = { type: 'path', d: '...' };

const shape3PositionA = { type: 'path', d: '...' };
const shape3PositionB = { type: 'path', d: '...' };

const shape1 = shape( shape1PositionA, shape1PositionB );
const shape2 = shape( shape2PositionA, shape2PositionB );
const shape3 = shape( shape3PositionA, shape3PositionB );

const animation = timeline(
  { shape: shape1, name: 'FIRST_ANIMATION' },
  { shape: shape2, queue: 200 },
  { shape: shape3, queue: [ 'FIRST_ANIMATION', -200 ]}
);

render({ selector: '.svg' }, animation );

play( animation, { duration: 1800 });
```

Timeline:


```
shape1 A------B
shape2           A------B
shape3       A------B
```

### Animate along a motion path

```js
import { shape, render, play } from 'wilderness';

const circle = {
  type: 'circle',
  cx: 100,
  cy: 150,
  r: 25,
  fill: '#E54',
};

const motionPath = {
  type: 'rect',
  x: 0,
  y: 0,
  width: 300,
  height: 100,
};

const animation = shape( circle, { motionPath });

render({ selector: '.svg' }, animation );

play( animation, { duration: 1800 });
```

A motion path is relative to the shape being animated.
You almost certainly want to make the starting point
`0`, `0`.

### Events

Both [plain shape objects](#plain-shape-object) and the
[`play()` function](#play-function) can take `start`,
`update` and `finish` functions. This gives you the power
to run callbacks at an animation wide level, as well as at
a specific stage of the animation.

```js
import { shape, render, play } from 'wilderness';

const sharedProperties = {
  type: 'circle',
  r: 25,
  fill: '#E54',
};

const positionA = { ...sharedProperties, cx: 100, cy: 150 };
const positionB = { ...sharedProperties, cx: 50, cy: 200 };

const positionC = {
  ...sharedProperties,
  cx: 65,
  cy: 100,
  start: () => console.log(
    'Runs when the animation between positionB and postionC starts'
  ),
  update: () => console.log(
    'Runs every time the animation between positionB and postionC is updated'
  ),
  finish: () => console.log(
    'Runs when the animation between positionB and postionC finishes'
  ),
};

const positionD = { ...sharedProperties, cx: 200, cy: 50 };

const animation = shape( positionA, positionB, positionC, positionD );

render({ selector: '.svg' }, animation );

play( animation, {
  duration: 1800,
  start: () => console.log(
    'Runs when the entire animation starts'
  ),
  update: () => console.log(
    'Runs every time the entire animation is updated'
  ),
  finish: () => console.log(
    'Runs when the entire animation finishes'
  ),
});
```

### CommonJS

This is how you get to the good stuff if you're using
`require`.

```js
const Wilderness = require( 'wilderness' );
const shape = Wilderness.shape;
const timeline = Wilderness.timeline;
const render = Wilderness.render;
const play = Wilderness.play;
const pause = Wilderness.pause;
const state = Wilderness.state;
```

### UMD

And if you just want to smash in a Javascript file you're
also covered. Drop this in place ...

[https://npmcdn.com/wilderness/dist/wilderness.min.js](https://npmcdn.com/wilderness/dist/wilderness.min.js)

Then access it on the `Wilderness` global variable.

```js
const shape = Wilderness.shape;
const timeline = Wilderness.timeline;
const render = Wilderness.render;
const play = Wilderness.play;
const pause = Wilderness.pause;
const state = Wilderness.state;
```

## API

### Terminology

- [Plain shape object](#plain-shape-object)
- [Shape](#shape)
- [Timeline](#timeline)

#### Plain shape object

A **plain shape object** is the way to communicate shapes in
Wilderness.

It is simply a Javascript object that expects certain
properties.

```js
{
  type: 'circle',
  cx: 10,
  cy: 10,
  r: 5,
  fill: '#E54',
};
```

##### Shape properties

Every plain shape object must define a set of shape
properties, as defined by
[SVG Points](https://github.com/colinmeinke/svg-points#shape-types).

###### Circle

- `type` is a *string* that must be 'circle'
- `cx` is a *number* that defines the circle's `cx` attribute
- `cy` is a *number* that defines the circle's `cy` attribute
- `r` is a *number* that defines the circle's `r` attribute

###### Ellipse

- `type` is a *string* that must be 'ellipse'
- `cx` is a *number* that defines the ellipse's `cx` attribute
- `cy` is a *number* that defines the ellipse's `cy` attribute
- `rx` is a *number* that defines the ellipse's `rx` attribute
- `ry` is a *number* that defines the ellipse's `ry` attribute

###### Group

- `type` is a *string* that must be 'g'
- `shapes` is an *array* of plain shape objects

###### Line

- `type` is a *string* that must be 'line'
- `x1` is a *number* that defines the line's `x1` attribute
- `x2` is a *number* that defines the line's `x2` attribute
- `y1` is a *number* that defines the line's `y1` attribute
- `y2` is a *number* that defines the line's `y2` attribute

###### Path

- `type` is a *string* that must be 'path'
- `d` is a *string* that defines the path's `d` attribute

###### Polygon

- `type` is a *string* that must be 'polygon'
- `points` is a *string* that defines the polygon's `points`
   attribute

###### Polyline

- `type` is a *string* that must be 'polyline'
- `points` is a *string* that defines the polyline's `points`
  attribute

###### Rect

- `type` is a *string* that must be 'rect'
- `height` is a *number* that defines the rect's 'height'
  attribute
- `width` is a *number* that defines the rect's 'width'
  attribute
- `x` is a *number* that defines the rect's 'x' attribute
- `y` is a *number* that defines the rect's 'y' attribute
- `rx` is a *number* that defines the rect's 'rx' attribute
- `ry` is a *number* that defines the rect's 'ry' attribute

##### Shape manipulation properties

Wilderness can help you manipulate your plain shape objects
with a few handy functions taken from
[Points](https://github.com/colinmeinke/points).

The functions are defined as the following properties.

- `moveIndex` is a *number* that defines the amount of points
  to offset the index
- `offset` is an *array* that includes:
  - a *number* that defines the amount to offset horizontally
  - a *number* that defines the amount to offset vertically
- `reverse` is a *boolean* that when:
  - `true` reverses the order of points
  - `false` has no effect
- `scale` is either:
  - a *number* that defines the scale factor, or
  - an *array* that includes:
    - a *number* that defines the scale factor
    - a *string* that defines the anchor point, one of:
      - `center`
      - `topLeft`
      - `topRight`
      - `bottomRight`
      - `bottomLeft`

When [morphing shapes](#morph-a-shape) playing about with a
combination of `moveIndex` and `reverse` can be handy to
create a more natural transition.

##### Style properties

On top of defining shape structure, Wilderness also cares
about how a shape is styled. Therefore a plain shape object
can also have any of the following optional style properties.

- `fill` is a *string* that defines the shape's `fill`
  attribute
- `fillOpactity` is a *number* that defines the shape's
  `fill-opacity` attribute
- `fillRule` is a *string* that defines the shape's
  `fill-rule` attribute
- `stroke` is a *string* that defines the shape's `stroke`
  attribute
- `strokeDasharray` is a *string* that defines the shape's
  `stroke-dasharray` attribute
- `strokeDashoffset` is a *string* that defines the shape's
  `stroke-dashoffset` attribute
- `strokeLinecap` is a *string* that defines the shape's
  `stroke-linecap` attribute
- `strokeLinejoin` is a *string* that defines the shape's
  `stroke-linejoin` attribute
- `strokeOpactity` is a *number* that defines the shape's
  `stroke-opacity` attribute
- `strokeWidth` is a *number* that defines the shape's
  `stroke-width` attribute
- `vectorEffect` is a *string* that defines the shape's
  `vector-effect` attribute

##### Animation properties

When multiple plain shape objects are passed to the
[`shape()` function](#shape-function) to create a
[shape](#shape), all but the initial object can take animation
properties. Animation properties define the transition from
one shape to the next.

- `delay` is a *number* that defines how many milliseconds to
  wait before the animation starts
- `duration` is a *number* that defines how many milliseconds
  the animation lasts
- `easing` is either:
  - a *string* that defines one of the predefined easing
    functions, one of:
    - `linear`
    - `easeInQuad`
    - `easeOutQuad`
    - `easeInOutQuad`
    - `easeInCubic`
    - `easeOutCubic`
    - `easeInOutCubic`
    - `easeInQuart`
    - `easeOutQuart`
    - `easeInOutQuart`
    - `easeInQuint`
    - `easeOutQuint`
    - `easeInOutQuint`
    - `easeInSine`
    - `easeOutSine`
    - `easeInOutSine`
    - `easeInExpo`
    - `easeOutExpo`
    - `easeInOutExpo`
    - `easeInCirc`
    - `easeOutCirc`
    - `easeInOutCirc`
    - `easeInElastic`
    - `easeOutElastic`
    - `easeInOutElastic`
    - `easeInBack`
    - `easeOutBack`
    - `easeInOutBack`
    - `easeInBounce`
    - `easeOutBounce`
    - `easeInOutBounce`
  - a *function* that returns a *number* when given the
    arguments:
    - a *number* that defines how many milliseconds have
      passed since the animation started
    - a *number* that defines the start position
    - a *number* that defines the end position
    - a *number* that defines the total number of milliseconds
      in the animation
- `finish` is a *function* that is called when the animation
  finishes
- `motionPath` is a *plain shape object* that defines the
  motion path of the animation. It can also include the
  following additional properties:
    - `accuracy` is a *number* between `0` and `360` that is
      used to calculate if a curve is *straight enough* to be
      considered a straight line. The smaller the number, the
      more accurate (smoother) the animation. Only relevant
      for shapes that include curves.
    - `easing` is either a *string* or a *function*.
    - `rotate` is either:
      - a *boolean* that defines if the shape should
        be rotated with the angle of the motion path
      - a *number* to offset the angle of the motion
        path and rotate the shape
- `name` is a *string* that can be used to reference this
  animation by objects in a
  [`timeline()` function](#timeline-function)
- `start` is a *function* that is called when the animation
  starts
- `update` is a *function* that is called every time the
  animation updates

##### Retrieving properties from the DOM

- `selector` is a *string* that will be passed to
  [querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector)
  to get an existing SVG element from the DOM from which all
  valid plain shape object properties will be retrieved

#### Shape

A **shape** represents a shape over time.

A shape is created by passing one or more
[plain shape objects](#plain-shape-object) into the
[`shape()` function](#shape-function). Plain shape objects
passed to the `shape()` function may have
[animation properties](#animation-properties).

Shapes are *renderable* and can be passed into the
[`render()` function](#render-function).

Shapes are *queueable* and can be passed into the
[`timeline()` function](#timeline-function).

Shapes are *playable* and can be passed into the
[`play()` function](#play-function) and
[`pause()` function](#play-function).

```js
shape(
  {
    type: 'circle',
    cx: 10,
    cy: 10,
    r: 5,
    fill: '#E54',
  },
  {
    type: 'circle',
    cx: 100,
    cy: 50,
    r: 5,
    fill: '#E54',
  }
);
```

#### Timeline

A **timeline** represents one of more [shapes](#shape) over
time.

A timeline is created by passing one or more *queueable* into
the [`timeline()` function](#timeline-function).

Timelines are *renderable* and can be passed into the
[`render()` function](#render-function).

Timelines are *playable* and can be passed into the
[`play()` function](#play-function) and
[`pause()` function](#play-function).

```
timeline(
  { shape: shape1, name: 'FIRST_ANIMATION' },
  { shape: shape2, queue: 200 },
  { shape: shape3, queue: [ 'FIRST_ANIMATION', -200 ]}
);
```

### `shape()` function

Creates and returns a new [shape](#shape).

#### Syntax

```js
shape( shape1[, shape2[, ..., shapeN ]]);
```

Where:

- `shape1` is either:
  - a *[plain shape object](#plain-shape-object)* that
    represents the initial state of a shape
  - an *object* that includes:
    - `selector` is a *string* that will be passed to
      [querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector)
      to get an existing element from the DOM. This must
      return an SVG shape that will be used to create a plain
      shape object
- `shapeN` is either:
  - a *plain shape object* that represents the state of a
    shape at a specific point in time
  - an *object* that includes:
    - `selector` is a *string* that will be passed to
      [querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector)
      to get an existing element from the DOM. This must
      return an SVG shape that will be used to create a plain
      shape object

### `timeline()` function

Creates and returns a new [timeline](#timeline).

#### Syntax

```js
timeline( queueable1[, queueable2[, ..., queueableN ]]);
```

Where:

- `queueableN` is either:
 - a *[shape](#shape)* that will be queued on the timeline, or
 - an *object* that includes:
    - `shape` is a *shape* that will be queued on the timeline
    - `name` is a *string* that can be used to reference this
      animation by other objects in this timeline
    - `queue` is either:
      - a *string* that references a point to queue this
        animation after. It can either be the name of another
        shape in this timeline, or a specific animation within
        another shape
      - a *number* that defines how many milliseconds to
        offset the start of this animation
      - an *array* that includes:
        - a *string* that references a point to queue this
          animation after. It can either be the name of another
          shape in this timeline, or a specific animation within
          another shape
        - a *number* that defines how many milliseconds to
          offset the start of this animation

### `render()` function

Finds or creates an
[svg element](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/svg)
in the DOM, and appends [shape's](#shape) and
[timeline's](#timeline) DOM nodes to it.

#### Syntax

```js
render( target, renderable1[, renderable2[, ..., renderableN ]]);
```

Where:

- `target` is an *object* that includes:
    - `height` is a *number* that defines the `height`
      attribute of the svg element
    - `preserveAspectRatio` is a *string* that defines the
      `preserveAspectRatio` attribute of the svg element
    - `selector` is a *string* that will be passed to
      [querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector)
      to get an existing element from the DOM. If the element
      retrieved is an svg element it will used as the DOM
      element to append shapes to. If the element retrieved is
      *not* an svg element, a new one will be created and
      appended to the retrieved element
    - `viewBox` is a *string* that defines the `viewBox`
      attribute of the svg element
    - `width` is a *number* that defines the `width`
      attribute of the svg element
- `renderableN` is either:
  - a *shape* whose DOM node will be appended to the the svg
    element, or
  - a *timeline* whose shape's DOM nodes will be appended to
    the the svg element

### `play()` function

Starts playback of a [shape](#shape) or a
[timeline](#timeline).

#### Syntax

```js
play( playable[, options ]);
```

Where:

- `playable` is either:
  - a *shape* to play, or
  - a *timeline* to play
- `options` is an *object*, with the properties:
  - `alternate` is a *boolean* that when:
    - `true` will alternate playback direction on each iteration
    - `false` will playback in the same direction on each iteration
  - `delay` is a *number* that defines how many milliseconds
    to wait before the animation starts
  - `duration` is a *number* that defines how many
    milliseconds the animation lasts
  - `finish` is a *function* that is called when the animation
    finishes
  - `initialProgress` is a *number* between `0` and `1` that defines
    the starting point for playback. It is relative to the starting
    direction defined by the `reverse` argument – an `initialProgress`
    of `0.8` and `reverse` of `false` will start the animation at the
    same point in an animation as an `initialProgress` of `0.2` and
    `reverse` of `true`.
  - `iterations` is a *number* that defines how many times the
    animation will run. It is relative to `initialProgress` - an
    `initialProgress` of `0.3` and `iterations` of `2.5` will end
    the animation a `0.8` on the third iteration.
  - `rate` is a *number* that defines the playback rate of the
    animation
  - `reverse` is a *boolean* that when:
    - `true` starts animation playing in reverse
    - `false` starts animation playing from the start
  - `start` is a *function* that is called when the animation
    starts
  - `update` is a *function* that is called every time the
    animation updates

### `pause()` function

Stops playback of a [shape](#shape) or a
[timeline](#timeline).

#### Syntax

```js
pause( playable );
```

Where:

- `playable` is either:
  - a *shape* to pause, or
  - a *timeline* to pause

### `state()` function

Returns the current state of a [shape](#shape).

#### Syntax

```js
state( shape );
```

Where:

- `shape` is a *shape*

## Help make this better

[Issues](https://github.com/colinmeinke/wilderness/issues/new)
and pull requests gratefully received!

I'm also on twitter
[@colinmeinke](https://twitter.com/colinmeinke).

Thanks :star2:

## License

[ISC](./LICENSE.md).
