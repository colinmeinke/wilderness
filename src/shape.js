import { plainShapeObject } from 'wilderness-dom-node'
import { shape as coreShape } from 'wilderness-core'

const shape = (...props) => {
  const s = coreShape(...props.map(prop => {
    if (prop.el) {
      const p = {
        ...plainShapeObject(prop.el),
        ...prop
      }

      delete p.el

      return p
    }

    return prop
  }))

  const { replace } = props.length > 1 && typeof props[ props.length - 1 ].type === 'undefined'
    ? props[ props.length - 1 ]
    : {}

  if (replace) {
    s.replace = replace
  }

  return s
}

export default shape
