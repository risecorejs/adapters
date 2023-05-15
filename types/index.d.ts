import * as sequelize from 'sequelize'

export type TModel<M> = typeof sequelize.Model & { new (): M }
