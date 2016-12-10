/* globals test expect */

import { colorIn } from '../../../src/core/helpers/color'

test('colorIn should return hex color object when passed hex string', () => {
  expect(colorIn('#FFFFFF')).toMatchObject({ colorType: 'hex' })
})
