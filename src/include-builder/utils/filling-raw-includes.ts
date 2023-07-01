import * as interfaces from '../../../interfaces/include-builder'

export default function fillingRawIncludes(
  model: any,
  rawIncludes: Record<string, any>,
  options: Omit<interfaces.IOptions,  'overwrite'>,
  prevIncludeAlias?: string,
  prevModel?: any
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

      if (!options.firstLevel && options.aliases?.includes(includeAlias)) {
        fillingRawIncludes(model.associations[associationKey].target, rawIncludes, options, includeAlias, model)
      }
    }
  }
}
