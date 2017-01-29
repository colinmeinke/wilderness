import { shape, render, play } from './tmp'

const from1 = {
  type: 'path',
  d: 'M20,20H80V80H20ZM30,30V70H70ZM40,40H60V60H40Z',
  fillRule: 'evenodd',
  rotate: 45
}

const from2 = {
  type: 'path',
  d: 'M20,120H80V180H20ZM30,130V170H70ZM40,140H60V160H40Z',
}

const from3 = {
  type: 'path',
  d: 'M20,220H80V280H20ZM30,230V270H70ZM40,240H60V260H40ZM35,250V265H50Z',
}

const to1 = {
  type: 'path',
  d: 'M290,40h20v20h-20z',
}

const to2 = {
  type: 'path',
  d: 'M290,140h20v20h-20z',
}

const to3 = {
  type: 'path',
  d: 'M290,240h20v20h-20z',
}

const animation1 = shape(from1, to1)
const animation2 = shape(from2, to2)
const animation3 = shape(from3, to3)

render(
  { selector: '.svg' },
  shape({ ...from1, fill: 'rgba(0,0,0,0.2)' }),
  shape({ ...from2, fill: 'rgba(0,0,0,0.2)' }),
  shape({ ...from3, fill: 'rgba(0,0,0,0.2)' }),
  shape({ ...to1, fill: 'rgba(0,0,0,0.2)' }),
  shape({ ...to2, fill: 'rgba(0,0,0,0.2)' }),
  shape({ ...to3, fill: 'rgba(0,0,0,0.2)' }),
  animation1,
  animation2,
  animation3
)

play(animation1, {
  duration: 4000,
  iterations: Infinity,
  alternate: true
})

play(animation2, {
  duration: 4000,
  iterations: Infinity,
  alternate: true
})

play(animation3, {
  duration: 4000,
  iterations: Infinity,
  alternate: true
})
