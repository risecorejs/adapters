import * as sequelize from 'sequelize'

export interface IOptions {
  firstLevel?: boolean
  aliases?: Array<string>
  assign?: Record<string, sequelize.Includeable>
}
