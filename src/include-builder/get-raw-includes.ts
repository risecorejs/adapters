import fillingRawIncludes from './utils/filling-raw-includes'

import * as interfaces from '../../interfaces/include-builder'

export default function (model: any, options: interfaces.IOptions = {}) {
  const rawIncludes: Record<string, any> = {}

  fillingRawIncludes(model, rawIncludes, {
    firstLevel: options.firstLevel ?? true,
    aliases: options.aliases
  })

  if (options.aliases?.length) {
    options.aliases = [...new Set(options.aliases)]

    if (options.aliases.every((item) => item.startsWith('-'))) {
      for (const alias of options.aliases) {
        if (alias.startsWith('-')) {
          for (const key of Object.keys(rawIncludes).filter((item) => item.startsWith(alias.slice(1)))) {
            delete rawIncludes[key]
          }
        }
      }
    } else {
      const _includes: Record<string, any> = {}

      for (const alias of options.aliases) {
        const clearAlias = alias.endsWith('.*') ? alias.slice(0, alias.length - 2) : alias

        if (rawIncludes.hasOwnProperty(clearAlias)) {
          let str = ''

          for (const item of clearAlias.split('.')) {
            const key = (str = str ? str + '.' + item : item)

            _includes[key] = rawIncludes[key]
          }

          _includes[clearAlias] = rawIncludes[clearAlias]
        }

        if (alias.endsWith('.*')) {
          for (const includeAlias in rawIncludes) {
            if (rawIncludes.hasOwnProperty(includeAlias) && includeAlias.startsWith(clearAlias)) {
              _includes[includeAlias] = rawIncludes[includeAlias]
            }
          }
        }
      }

      for (const includeAlias in rawIncludes) {
        if (rawIncludes.hasOwnProperty(includeAlias)) {
          delete rawIncludes[includeAlias]
        }
      }

      Object.assign(rawIncludes, _includes)
    }
  }

  if (options.assign) {
    for (const includeAlias in options.assign) {
      if (options.assign.hasOwnProperty(includeAlias) && rawIncludes.hasOwnProperty(includeAlias)) {
        Object.assign(rawIncludes[includeAlias], options.assign[includeAlias])
      }
    }
  }

  return rawIncludes
}
