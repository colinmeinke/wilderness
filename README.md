# Wilderness

A Javascript API for building and animating SVG.

Currently in development ...

## Features

- [Morph a shape](#morph-a-shape)
- [Overlap multiple animations on a timeline](#overlap-multiple-animations-on-a-timeline)
- [Powerful playback controls](#play-function)
- [Animate along a motion path](#animate-along-a-motion-path)
- [React integration](#react-wilderness)

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

const position1 = {
  type: 'circle',
  cx: 100,
  cy: 150,
  r: 25,
  fill: '#E54',
};

const position2 = { cx: 50, cy: 200 };

const animation = shape( position1, position2 );

render({ selector: '.svg' }, animation );

play( animation, { duration: 1800 });
```

### Move a shape (some more)

```js
import { shape, render, play } from 'wilderness';

const position1 = {
  type: 'circle',
  cx: 100,
  cy: 150,
  r: 25,
  fill: '#E54',
};

const position2 = { cx: 50, cy: 200 };
const position3 = { cx: 65, cy: 100 };
const position4 = { cx: 200, cy: 50 };

const animation = shape( position1, position2, position3, position4 );

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

const shape1Position1 = { type: 'path', d: '...' };
const shape1Position2 = { d: '...' };

const shape2Position1 = { type: 'path', d: '...' };
const shape2Position2 = { d: '...' };

const shape3Position1 = { type: 'path', d: '...' };
const shape3Position2 = { d: '...' };

const shape1 = shape( shape1Position1, shape1Position2 );
const shape2 = shape( shape2Position1, shape2Position2 );
const shape3 = shape( shape3Position1, shape3Position2 );

const animation = timeline( shape1, shape2, shape3 );

render({ selector: '.svg' }, animation );

play( animation, { duration: 1800 });
```

Timeline:

```
shape1------
shape2      ------
shape3            ------
```

### Overlap multiple animations on a timeline

```js
import { shape, timeline, render, play } from 'wilderness';

const shape1Position1 = { type: 'path', d: '...' };
const shape1Position2 = { d: '...' };

const shape2Position1 = { type: 'path', d: '...' };
const shape2Position2 = { d: '...' };

const shape3Position1 = { type: 'path', d: '...' };
const shape3Position2 = { d: '...' };

const shape1 = shape( shape1Position1, shape1Position2 );
const shape2 = shape( shape2Position1, shape2Position2 );
const shape3 = shape( shape3Position1, shape3Position2 );

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
shape1--------
shape2          --------
shape3      --------
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
  x: 100,
  y: 150,
  width: 300,
  height: 100,
};

const animation = shape( circle, { motionPath });

render({ selector: '.svg' }, animation );

play( animation, { duration: 1800 });
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
- `rx` is a *number* thatdefines the rect's 'rx' attribute
- `ry` is a *number* thatdefines the rect's 'ry' attribute

##### Shape manipulation properties

Wilderness can help you manipulate your plain shape objects
with a few handy functions taken from
[Points](https://github.com/colinmeinke/points).

The functions are defined as the following properties.

- `moveIndex` is a *number* that ...
- `offset` is an *array* that ...
- `reverse` is a *boolean* that ...
- `scale` is a *number* or *array* that ...

##### Style properties

On top of defining shape structure, Wilderness also cares
about how a shape is styled. Therefore a plain shape object
can also have any of the following optional style properties.

- `fill` is a *string* that ...
- `fillRule` is a *string* that ...
- `stroke` is a *string* that ...
- `strokeDasharray` is a *string* that ...
- `strokeDashoffset` is a *string* that ...
- `strokeWidth` is a *number* that ...
- `vectorEffect` is a *string* that ...

##### Animation properties

When multiple plain shape objects are passed to the
[`shape()` function](#shape-function) to create a
[shape](#shape), all but the initial object can take animation
properties. Animation properties define the transition from
one shape to the next over time.

- `delay` is a *number* that ...
- `duration` is a *number* that ...
- `easing` is a *string* or *function* that ...
- `finish` is a *function* that is called when this
  animation finishes
- `motionPath` is a *shape* or an *array* that ...
- `name` is a *string* that can be referenced by objects in
  a [`timeline()` function](#timeline-function)
- `start` is a *function* that is called when this
  animation starts

##### Retrieving properties from the DOM

- `selector` is a *string* that will be passed to
  [querySelectorAll](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll)
  to retrieve an existing SVG element from the DOM

#### Shape

A **shape** represents a shape over time.

A shape is created by passing one or more
[plain shape object](#plain-shape-object) into the
[`shape()` function](#shape-function). Plain shape objects
passed to the `shape()` function have
[animation properties](#animation-properties).

Multiple shapes can be queued to to make
[timelines](#timeline) using the
[`timeline()` function](#timeline-function).

Shapes are *playable* and can be passed into the
[`render()` function](#render-function),
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
    cx: 100,
    cy: 50,
    fill: '#E76',
  }
);
```
##### Property inheritance

When creating shapes with the `shape()` function, it is useful
to note that additional shapes will inherit properties from
the initial shape.

In the example above the second object will inherit
the properties `type`, `r` and `fill` from the first object.

#### Timeline

A **timeline** represents one of more [shapes](#shape) over
time.

A timeline is created by passing one or more *queueable* into
the [`timeline()` function](#timeline-function).

Timelines are *playable* and can be passed into the
[`render()` function](#render-function),
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

Creates a new [shape](#shape).

#### Syntax

```js
shape( shape1[, shape2[, ..., shapeN ]]);
```

Where:

- `shapeN` is a [plain shape object](#plain-shape-object)

### `timeline()` function

Creates a new [timeline](#timeline).

#### Syntax

```js
timeline( queueable1[, queueable2[, ..., queueableN ]]);
```

Where:

- `queueableN` is a *[shape](#shape)* or an *object*, with the
  properties:
    - `shape` is a *shape*
    - `name` is a *string* that ...
    - `queue` is a *string* or a *number* or an *array* that
      ...

### `render()` function

Renders [shapes](#shape) and [timelines](#timeline) to the
DOM.

#### Syntax

```js
render( target, playable1[, playable2[, ..., playableN ]]);
```

Where:

- `target` is an *object*, with the properties:
    - `height` is a *number* that ...
    - `preserveAspectRatio` is a *string* that ...
    - `selector` is a *string* that ...
    - `viewBox` is a *string* that ...
    - `width` is a *number* that ...
- `playableN` is a *shape* or a *timeline*

### `play()` function

Starts playback of a [shape](#shape) or a
[timeline](#timeline).

#### Syntax

```js
play( playable[, options ]);
```

Where:

- `playable` is a *shape* or a *timeline*
- `options` is an *object*, with the properties:
    - `delay` is a *number* that ...
    - `direction` is a *string* that ...
    - `duration` is a *number* that ...
    - `iterations` is a *number* that ...
    - `progress` is a *number* that ...
    - `rate` is a *number* that ...

### `pause()` function

Stops playback of a [shape](#shape) or a
[timeline](#timeline).

#### Syntax

```js
pause( playable );
```

Where:

- `playable` is a *shape* or a *timeline*

### react-wilderness

#### `<SVG>` component

##### Syntax

```jsx
<SVG props={ props } />
```

#### `<Shape />` component

##### Syntax

```jsx
<SVG>
  <Shape props={ position1 }>
    <Shape props={ position2 } />
    <Shape props={ position3 } />
  </Shape>
</SVG>
```

#### `<Play />` component

##### Syntax

```jsx
<SVG>
  <Play props={ options }>
    <Shape name={ name }>
      <Shape />
      <Shape />
    </Shape>
    <Shape queue={ queue }>
      <Shape />
      <Shape />
    </Shape>
  </Play>
</SVG>
```

## Help make this better

[Issues](https://github.com/colinmeinke/wilderness/issues/new)
and pull requests gratefully received!

I'm also on twitter
[@colinmeinke](https://twitter.com/colinmeinke).

Thanks :star2:

## License

[ISC](./LICENSE.md).
