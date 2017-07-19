import { plainShapeObject } from 'wilderness-dom-node'
import { shape as coreShape } from 'wilderness-core'

const shape = (...props) => {
  return coreShape(...props.map(prop => {
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
}

export default shape
