# Wilderness

An API for building and moving SVG.

Nothing works yet. These are just my initial ideas for the
API.

## Features

- Morph shapes with any number of points
- Sequence animations on a timeline
- Animate a group of shapes
- Animate along a motion path
- Create dynamic animations based on user interaction
- Build and render universally

## Installation

```
npm install --save wilderness
```

## Usage

### Create a new SVG

```js
import { create } from 'wilderness';

const svg = create({
  height: 300,
  width: 500,
  viewBox: '0 0 500 300',
});

// ...

svg.render( '.svg-container' );
```

### Hook up an existing SVG

```js
import { create } from 'wilderness';

const svg = create( '.svg' );

// ...

svg.render();
```

### Create a new shape

```js
import { create } from 'wilderness';

const svg = create( '.svg' );

const shape = svg.add({
  shape: 'circle',
  cx: 10,
  cy: 10,
  r: 10,
  fill: '#E54',
});

svg.render();
```

### Hook up an existing shape

```js
import { create } from 'wilderness';

const svg = create( '.svg' );

const shape = svg.add( '.shape' );

svg.render();
```

### Animate a shape

```js
import { animate, create } from 'wilderness';

const svg = create( '.svg' );

const shape = svg.add( '.shape' );

shape.to({ r: 5, fill: '#E65' });

const animation = animate( shape );

animation.play({
  duration: 1000,
  easing: 'easeInElastic',
});

svg.render();
```

### Animate a group of shapes

```js
import { animate, create } from 'wilderness';

const svg = create( '.svg' );

const group = svg.add({
  shape: 'g',
  shapes: [
    {
      shape: 'rect',
      x: 0,
      y: 0,
      width: 50,
      height: 50,
      fill: '#111',
    },
    {
      shape: 'rect',
      x: 50,
      y: 50,
      width: 50,
      height: 50,
      fill: '#222',
    },
    {
      shape: 'rect',
      x: 100,
      y: 100,
      width: 50,
      height: 50,
      fill: '#333',
    },
  ],
});

group.to({ shapes: [
  { x: 50, delay: 100, duration: 250, easing: 'easeInQuad' },
  { x: 0, delay: 200, duration: 350, easing: 'linear' },
  { x: 50, delay: 300, duration: 450, easing: 'easeOutQuad' },
]);

const animation = animate( group );

animation.play();

svg.render();
```

### Create a basic animation sequence

By default `animate` orders animations in sequence.

In the following timeline, the `shape1` animation will play
first. Once it completes the `shape2` animation will play.

```js
import { animate, create } from 'wilderness';

const svg = create( '.svg' );

const shape1 = svg.add( '.shape1' );

shape1.to({ fill: '#FFF' });
shape1.to({ fill: '#000' });

const shape2 = svg.add( '.shape2' );

shape2.to({ x: 50, y: 40 });

const animation = animate( shape1, shape2 );

animation.play();

svg.render();
```

### Create a more complex animation sequence

```js
import { animate, create } from 'wilderness';

const svg = create( '.svg' );

const shape1 = svg.add( '.shape1' );

shape1.to({ duration: 250, ... });
shape1.to({ duration: 250, ... });

const shape2 = svg.add( '.shape2' );

shape2.to({ duration: 100, ... });
shape2.to({ duration: 300, name: 'shape2-second-animation', ... });
shape2.to({ duration: 200, ... });
shape2.to({ duration: 200, ... });

const shape3 = svg.add( '.shape3' );

shape3.to({ duration: 400, ... });

const shape4 = svg.add( '.shape4' );

shape4.to({ delay: 100, duration: 100, name: 'shape4-first-animation' ... });
shape4.to({ delay: 200, duration: 400, ... });

const shape5 = svg.add( '.shape5' );

shape5.to({ duration: 500, ... });

const shape6 = svg.add( '.shape6' );

shape6.to({ duration: 200, ... });

const animation = animate(
  { shape: shape1, name: 'shape1' },
  shape2,
  { shape: shape3, queue: [ 'shape1', -300 ]},
  { shape: shape4, queue: 'shape2-second-animation' },
  { shape: shape5, queue: [ 'shape4-first-animation', 100 ]},
  { shape: shape6, queue: -100 },
);

animation.play({
  delay: 200,
  direction: 'alternate',
  iterations: Infinity,
  speed: 2,
});

svg.render();
```

This timeline would overlap.

````
shape1 -----
shape2      --------
shape3   ----
shape4          --------
shape5             -----
shape6--
```

### Animate along a motion path

```js
import { animate, create } from 'wilderness';

const svg = create( '.svg' );

const shape = svg.add({
  shape: 'rect',
  x: 40,
  y: 0,
  width: 20,
  height: 20,
  fill: 'rgb(240,80,50)',
});

shape.to({
  motionPath: {
    shape: 'circle',
    cx: 50,
    cy: 50,
    r: 40,
  },
});

const animation = animate( shape );

animation.play({
  duration: 200,
  easing: 'easeInExpo',
});

svg.render();
```

### Create dynamic animations based on user interaction

Most of the time you will know what you want your animation to
look like ahead of time, and can define your shapes as
objects.

```js
const shape = svg.add({
  shape: 'circle',
  cx: 10,
  cy: 10,
  r: 10,
});

shape.to({
  cx: 50,
  cy: 75,
});
```

However, sometimes an animation depends on the result of an
interaction and needs to be calculated at runtime.

Wilderness factors for this by allowing shapes to also be
defined as functions (that return shape objects).

These shape functions are executed at runtime and are passed
the current state of the shape, and all properties defined on
`play`.

This gives you the power to calculate what the shape should
look like, where it should go and how fast based on on-the-fly
data.

```js
const ball = svg.add(({ shape }) => ({
  shape: 'circle',
  cx: shape ? shape.cx : 5,
  cy: shape ? shape.cy : 5,
  r: 5,
  fill: '#333',
}));

ball.to(({ acceleration, friction, mousePosition, shape }) => {
  const duration = // ...
  const easing = // ...
  const motionPath = // ...

  return { duration, easing, motionPath };
});

const animation = animate( ball );

// an interaction takes place

animation.play({
  acceleration: // ...
  friction: // ...
  mousePosition: // ...
});
```

### Build and render universally

```js
// server.js
import express from 'express';
import { create } from 'wilderness';

const app = express();

const svg = create({
  id: 'svg',
  height: 300,
  width: 500,
  viewBox: '0 0 500 300',
});

svg.add({
  id: 'shape1',
  shape: 'rect',
  height: 200,
  width: 200,
  x: 50,
  y: 25,
  fill: '#E54',
});

svg.add({
  id: 'shape2',
  shape: 'polyline',
  points: '0,0 10,20 40,50',
  fill: 'none',
  stroke: '#E64',
  strokeWidth: 4,
});

const html = svg.markup();

app.get( '/', ( req, res ) => {
  res.send( `
    <!DOCTYPE html>
    <html>
      <head></head>
      <body>
        ${ html }
        <script src="client.js"></script>
      </body>
    </html>
  ` );
});

app.listen( 3000 );
```

```js
// client.js
import { create, animate } from 'wilderness';

const svg = create( '#svg' );

const shape1 = svg.add( '#shape1' );
const shape2 = svg.add( '#shape2' );

shape1.to({ x: 100, y: 50 });
shape2.to({ strokeWidth: 10 });

const animation = animate( shape1, shape2 );

animation.play({ delay: 1000, duration: 2000 });

svg.render();
```

## Help make this better

[Issues](https://github.com/colinmeinke/wilderness/issues/new)
and pull requests gratefully received!

I'm also on twitter
[@colinmeinke](https://twitter.com/colinmeinke).

Thanks :star2:

## License

[ISC](./LICENSE.md).
