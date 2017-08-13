# Wilderness &middot; [![gzip size](http://img.badgesize.io/https://unpkg.com/wilderness/dist/wilderness.production.js?compression=gzip&label=gzip%20size&style=flat&cache=false)](https://unpkg.com/wilderness/dist/wilderness.production.js) [![test coverage](https://img.shields.io/coveralls/colinmeinke/wilderness/master.svg?style=flat)](https://coveralls.io/github/colinmeinke/wilderness) [![travisci](https://img.shields.io/travis/colinmeinke/wilderness.svg?style=flat)](https://travis-ci.org/colinmeinke/wilderness) [![npm version](https://img.shields.io/npm/v/wilderness.svg?style=flat)](https://www.npmjs.com/package/wilderness)

An SVG animation API.

Documentation is a over at [wilderness.now.sh](https://wilderness.now.sh).

You can also check out the [examples directory](./examples).

---

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
