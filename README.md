# Wilderness &middot; [![gzip size](http://img.badgesize.io/https://unpkg.com/wilderness/dist/wilderness.production.js?compression=gzip&label=gzip%20size&style=flat&cache=false)](https://unpkg.com/wilderness/dist/wilderness.production.js) [![test coverage](https://img.shields.io/coveralls/colinmeinke/wilderness/master.svg?style=flat)](https://coveralls.io/github/colinmeinke/wilderness) [![travisci](https://img.shields.io/travis/colinmeinke/wilderness.svg?style=flat)](https://travis-ci.org/colinmeinke/wilderness) [![npm version](https://img.shields.io/npm/v/wilderness.svg?style=flat)](https://www.npmjs.com/package/wilderness)

An SVG animation API.

Wilderness combines a simple API, with the ability to create complex SVG
animations.

As well as all the things that you would expect an SVG animation library to
include, Wilderness has some very powerful features:

- **Shape morphing**. Morph from anything, to anything.
- **Full timeline control**. Sequence multiple shapes on a timeline. Use the
  powerful playback controls.
- **Middleware**. Create your own functions to transform shapes during animation.

Here is a quick example that shows just how simple it is to morph between two
shapes with Wilderness:

```js
import { shape, timeline, render, play } from 'wilderness'

const svg = document.querySelector('.svg')
const square = svg.querySelector('.square')
const circle = svg.querySelector('.circle')

// 1. Create a shape
const morph = shape({ el: square }, { el: circle })

// 2. Place the shape on a timeline
const playbackOptions = { alternate: true, iterations: Infinity }
const animation = timeline(morph, playbackOptions)

// 3. Render the timeline to the SVG
render(svg, animation)

// 4. Start playback of the timeline
play(animation)
```

Full documentation will appear shortly at
[wilderness.now.sh](https://wilderness.now.sh). In the meantime check out the [examples directory](./examples).

## Installation

Wilderness can be used as [an ES2015 module](#es2015-module),
[required with commonjs](#commonjs) or
[loaded with a script element](#umd).

First, get a copy of Wilderness by installing the npm distribution:

```
yarn add wilderness
```

or

```
npm --save wilderness
```

Alternatively, you can find the distribution on the [unpkg CDN](https://unpkg.com/wilderness-core/).

### ES2015 module

```js
import { shape, timeline, render, play } from 'wilderness'
```

### commonjs

```js
const { shape, timeline, render, play } = require('wilderness')
```

### UMD

If you just want to drop a javascript file onto a page, then this is the method
for you.

Look in the `dist` directory of the distribution and select either the [development](https://unpkg.com/wilderness/dist/wilderness.development.js)
or [production](https://unpkg.com/wilderness/dist/wilderness.production.js)
file.

Add a `script` tag linking to the file into your HTML layout, and you will then
have access to the global `Wilderness` object.

```js
const shape = Wilderness.shape
const timeline = Wilderness.timeline
const render = Wilderness.render
const play = Wilderness.play
```
