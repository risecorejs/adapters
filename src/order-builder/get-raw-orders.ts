import * as sequelize from 'sequelize'

import * as interfaces from '../../interfaces/order-builder'
import * as types from '../../types'

export default function <M extends sequelize.Model>(model: types.TModel<M>, options: interfaces.IOptions = {}) {
  const rawOrders: Record<string, any> = {}

  const rawAttributes = model.getAttributes()

  for (const attribute in rawAttributes) {
    if (rawAttributes.hasOwnProperty(attribute)) {
      // @ts-ignore
      if (rawAttributes[attribute].order === undefined || rawAttributes[attribute].order === true) {
        rawOrders[attribute] = [attribute]
      }
    }
  }

  if (options.fields?.length) {
    options.fields = [...new Set(options.fields)]

    if (options.fields.every((item) => item.startsWith('-'))) {
      for (const field of options.fields) {
        if (rawOrders.hasOwnProperty(field.slice(1))) {
          delete rawOrders[field.slice(1)]
        }
      }
    } else {
      const _rawOrders: Record<string, any> = {}

      for (const field of options.fields) {
        if (rawOrders.hasOwnProperty(field)) {
          _rawOrders[field] = rawOrders[field]
        }
      }

      for (const key in rawOrders) {
        if (rawOrders.hasOwnProperty(key)) {
          delete rawOrders[key]
        }
      }

      Object.assign(rawOrders, _rawOrders)
    }
  }

  if (options.assign) {
    for (const key in options.assign) {
      if (options.assign.hasOwnProperty(key)) {
        rawOrders[key] = options.assign[key]
      }
    }
  }

  return rawOrders
}
