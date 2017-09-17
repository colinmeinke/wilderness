/* globals __DEV__ */

import { plainShapeObject } from 'wilderness-dom-node'
import { shape as coreShape } from 'wilderness-core'

/**
 * Extends the Wilderness core shape function.
 * Adds the ability to pull keyframe attributes and points from a SVG DOM node.
 * Adds an optional replace property to a Shape, which is used during render.
 *
 * @param {(PlainShapeObject|Object)[]} props
 *
 * @returns {Shape}
 *
 * @example
 * shape({ el, style: '' }, { replace: el })
 */
const shape = (...props) => {
  const args = []

  for (let i = 0, l = props.length; i < l; i++) {
    const prop = props[ i ]

    if (prop.el) {
      const p = {
        ...plainShapeObject(prop.el),
        ...prop
      }

      delete p.el

      args.push(p)
    }

    args.push(prop)
  }

  const s = coreShape(...args)

  const options = props.length > 1 && typeof props[ props.length - 1 ].type === 'undefined'
    ? props[ props.length - 1 ]
    : {}

  const replace = options.replace

  if (replace) {
    if (__DEV__ && (typeof replace !== 'object' || !replace.nodeName)) {
      throw new TypeError(`The replace option must be a DOM node`)
    }

    s.replace = replace
  }

  return s
}

export default shape
