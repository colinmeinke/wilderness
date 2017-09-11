# Wilderness

An SVG animation API &middot; [https://wilderness.now.sh](https://wilderness.now.sh)

[![gzip size](http://img.badgesize.io/https://unpkg.com/wilderness/dist/wilderness.production.js?compression=gzip&label=gzip%20size&style=flat&cache=false)](https://unpkg.com/wilderness/dist/wilderness.production.js) [![test coverage](https://img.shields.io/coveralls/colinmeinke/wilderness/master.svg?style=flat)](https://coveralls.io/github/colinmeinke/wilderness) [![travisci](https://img.shields.io/travis/colinmeinke/wilderness.svg?style=flat)](https://travis-ci.org/colinmeinke/wilderness) [![npm version](https://img.shields.io/npm/v/wilderness.svg?style=flat)](https://www.npmjs.com/package/wilderness)

## Summary

- 🎉 Small file size (15.1kb minified + gzip)
- 🌟 Simple, functional API
- 🐣 Morph from anything, to anything
- ⏱️ Queue multiple animations on a timeline
- 🚀 Powerful playback control

## Hello world

```js
import { shape, render, timeline, play } from 'wilderness'

const morph = shape(
  { el: document.querySelector('circle') },
  { el: document.querySelector('rect') },
)

const animation = timeline(morph, {
  iterations: Infinity,
  alternate: true
})

render(document.querySelector('svg'), animation)

play(animation)
```

<br />

[Learn Wilderness](https://wilderness.now.sh/getting-started) &middot; [View examples](./examples)
