import * as sequelize from 'sequelize'

import * as interfaces from '../../../interfaces/include-builder'
import * as types from '../../../types'

export default function fillingRawIncludes<M extends sequelize.Model>(
  model: types.TModel<M>,
  rawIncludes: Record<string, any>,
  options: Omit<interfaces.IOptions, 'aliases' | 'overwrite'>,
  prevIncludeAlias?: string,
  prevModel?: types.TModel<M>
) {
  for (const associationKey in model.associations) {
    if (
      model.associations.hasOwnProperty(associationKey) &&
      (prevModel ? model.associations[associationKey].target.name !== prevModel.name : true)
    ) {
      const as = model.associations[associationKey].as

      const includeAlias = prevIncludeAlias ? prevIncludeAlias + '.' + as : as

      rawIncludes[includeAlias] = {
        model: model.associations[associationKey].target,
        as
      }

      if (!options.firstLevel) {
        fillingRawIncludes(model.associations[associationKey].target, rawIncludes, options, includeAlias, model)
      }
    }
  }
}
