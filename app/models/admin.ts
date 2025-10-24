import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import UserDatum from './user_datum.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { v4 as uuidv4 } from 'uuid'
import Position from './position.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class Admin extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: string

  @column({ columnName: 'user_data_id' })
  declare userDataId: string | null

  @column()
  declare positionId: string | null

  @column()
  declare nip: string | null

  @column()
  declare name: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare subject: string | null

  @column()
  declare status: number | null

  // @column.dateTime()
  // declare dateOfAcceptance: DateTime | null

  @belongsTo(() => UserDatum, { foreignKey: 'userDataId' })
  declare userData: BelongsTo<typeof UserDatum>

  @belongsTo(() => Position)
  declare position: BelongsTo<typeof Position>

  @column()
  declare profile: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare deletedAt: DateTime | null

  @beforeCreate()
  static assignUuid(data: Admin) {
    data.id = uuidv4()
  }
}
