import { shape, render, play, pause } from '../../src';

const positionA = {
  type: 'circle',
  cx: 15,
  cy: 50,
  r: 15,
  fill: '#E54',
};

const positionB = {
  cx: 85,
};

const animation = shape( positionA, positionB );

render({ selector: '.svg' }, animation );

const controls = document.querySelector( '.controls' );
const playButton = controls.querySelector( '.button--play' );
const playWithOptionsButton = controls.querySelector( '.button--play-with-options' );
const optionsButton = controls.querySelector( '.button--options' );
const options = controls.querySelector( '.options' );
const reverse = controls.querySelector( '.option--reverse .switch__input' );
const alternate = controls.querySelector( '.option--alternate .switch__input' );
const progress = controls.querySelector( '.option--progress .input' );
const delay = controls.querySelector( '.option--delay .input' );
const duration = controls.querySelector( '.option--duration .input' );
const rate = controls.querySelector( '.option--rate .input' );
const easing = controls.querySelector( '.option--easing .select__box' );
const iterations = controls.querySelector( '.option--iterations .input' );

let isPlaying = false;
let hasPlayed = false;

let state = {
  alternate: true,
  delay: 0,
  duration: 3000,
  easing: 'easeInOutQuad',
  initialProgress: 0,
  iterations: Infinity,
  rate: 1,
  reverse: false,
};

const updateState = newState => {
  state = { ...state, ...newState };
};

optionsButton.addEventListener( 'click', () => {
  options.classList.toggle( 'options--show' );
});

playButton.addEventListener( 'click', () => {
  playButton.classList.toggle( 'button--active' );

  if ( isPlaying ) {
    pause( animation );
    isPlaying = false;
  } else {
    if ( hasPlayed ) {
      play( animation );
    } else {
      play( animation, state );
      hasPlayed = true;
    }

    isPlaying = true;
  }
});

playWithOptionsButton.addEventListener( 'click', () => {
  play( animation, state );
  hasPlayed = true;
  isPlaying = true;
});

reverse.addEventListener( 'change', function () {
  updateState({ reverse: this.checked });
});

alternate.addEventListener( 'change', function () {
  updateState({ alternate: this.checked });
});

progress.addEventListener( 'change', function () {
  updateState({ initialProgress: parseFloat( this.value ) });
});

delay.addEventListener( 'change', function () {
  updateState({ delay: parseFloat( this.value ) });
});

duration.addEventListener( 'change', function () {
  updateState({ duration: parseFloat( this.value ) });
});

rate.addEventListener( 'change', function () {
  updateState({ rate: parseFloat( this.value ) });
});

easing.addEventListener( 'change', function () {
  updateState({ easing: this.value });
});

iterations.addEventListener( 'change', function () {
  const i = parseFloat( this.value );
  updateState({ iterations: i === 0 ? Infinity : i });
});
