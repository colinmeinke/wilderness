const babel = require('rollup-plugin-babel')
const commonJs = require('rollup-plugin-commonjs')
const fs = require('fs')
const Promise = require('bluebird')
const replace = require('rollup-plugin-replace')
const resolve = require('rollup-plugin-node-resolve')
const rollup = require('rollup').rollup
const uglify = require('rollup-plugin-uglify')

Promise.promisifyAll(fs)

const build = ({ file, input, format, plugins }) => new Promise((resolve, reject) => {
  rollup({ input, plugins })
    .then(bundle => bundle.write({ file, format, name: 'Wilderness' })
    .then(resolve))
    .catch(reject)
})

Promise.resolve(console.log('Creating UMD development bundle ...'))
  .then(() => build({
    file: 'dist/wilderness.development.js',
    input: 'src/index.js',
    format: 'umd',
    plugins: [
      babel({
        exclude: 'node_modules/**',
        plugins: [ 'transform-object-rest-spread', 'external-helpers' ],
        presets: [[ 'es2015', { 'modules': false } ]]
      }),
      commonJs(),
      resolve({ module: true }),
      replace({
        '__DEV__': true,
        "process.env.NODE_ENV !== 'production'": true
      })
    ]
  }))
  .then(() => Promise.resolve(console.log('UMD development bundle complete')))
  .then(() => Promise.resolve(console.log('Creating UMD production bundle ...')))
  .then(() => build({
    file: 'dist/wilderness.production.js',
    input: 'src/index.js',
    format: 'umd',
    plugins: [
      babel({
        exclude: 'node_modules/**',
        plugins: [ 'transform-object-rest-spread' ],
        presets: [[ 'es2015', { 'modules': false } ]]
      }),
      commonJs(),
      resolve({ module: true }),
      replace({
        '__DEV__': false,
        "process.env.NODE_ENV !== 'production'": false
      }),
      uglify()
    ]
  }))
  .then(() => Promise.resolve(console.log('UMD production bundle complete')))
  .then(() => Promise.resolve(console.log('Creating example bundles ...')))
  .then(() => fs.readdirAsync('examples')
  .then(files => Promise.filter(files, f => fs.lstatAsync(`examples/${f}`).then(x => Promise.resolve(x.isDirectory()))))
  .then(directories => Promise.all(directories.map(dir => (
    build({
      file: `examples/${dir}/dist.js`,
      input: `examples/${dir}/src.js`,
      format: 'iife',
      plugins: [
        babel({
          exclude: 'node_modules/**',
          plugins: [ 'transform-object-rest-spread' ],
          presets: [[ 'es2015', { 'modules': false } ]]
        }),
        commonJs(),
        resolve({ module: true }),
        replace({
          '__DEV__': true,
          "process.env.NODE_ENV !== 'production'": true
        })
      ]
    })
  ))))
  .then(() => Promise.resolve(console.log('Example bundles complete')))
  .catch(e => console.error(e)))
