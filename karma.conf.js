const babel = require('rollup-plugin-babel')
const commonJs = require('rollup-plugin-commonjs')
const replace = require('rollup-plugin-replace')
const resolve = require('rollup-plugin-node-resolve')

module.exports = config => {
  config.set({
    autoWatch: false,
    browsers: [ 'ChromeHeadless' ],
    colors: true,
    concurrency: Infinity,
    coverageReporter: {
      reporters: [
        { type: 'lcov' },
        { type: 'json' },
        { type: 'clover' },
        { type: 'text-summary' }
      ],
      subdir: '.'
    },
    files: [
      { pattern: 'src/**/*.js', included: false },
      'tests/**/*.js'
    ],
    frameworks: [ 'mocha', 'chai' ],
    logLevel: config.LOG_INFO,
    mochaReporter: {
      showDiff: true
    },
    port: 9876,
    preprocessors: {
      'src/**/*.js': [ 'rollup' ],
      'tests/**/*.js': [ 'rollup' ]
    },
    reporters: [ 'mocha', 'coverage' ],
    rollupPreprocessor: {
      exports: 'named',
      format: 'iife',
      name: 'wilderness',
      plugins: [
        babel({
          exclude: 'node_modules/**',
          plugins: [
            'transform-object-rest-spread',
            'external-helpers',
            [ 'istanbul', { 'exclude': [ 'node_modules/**', 'tests/**/*.js' ] } ]
          ],
          presets: [[ 'es2015', { 'modules': false } ]]
        }),
        commonJs(),
        resolve({ module: true }),
        replace({
          '__DEV__': true,
          "process.env.NODE_ENV !== 'production'": true
        })
      ],
      sourcemap: 'inline'
    }
  })
}
