import { DateTime } from 'luxon'
import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import UserDatum from './user_datum.js'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import Role from './role.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class Admin extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

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

  @column.dateTime()
  declare dateOfAcceptance: DateTime | null

  @hasOne(() => UserDatum)
  declare userData: HasOne<typeof UserDatum>

  @hasOne(() => Role)
  declare role: HasOne<typeof Role>

  @column()
  declare profile: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare deletedAt: DateTime | null
}
