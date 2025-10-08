import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  //
  @column()
  declare nim: string | null

  @column.dateTime()
  declare dob: DateTime | null

  @column()
  declare profile: string | null

  @column()
  declare major: string | null

  @column()
  declare position: string | null // Student, Lecturer, Staff

  @column()
  declare status: number | null

  @column.dateTime()
  declare dateOfAcceptance: DateTime | null

  @column()
  declare address: string | null

  @column()
  declare phone: string | null

  @column()
  declare subDistrict: string | null

  @column()
  declare city: string | null

  @column()
  declare province: string | null

  @column()
  declare postalCode: string | null

  @column()
  declare role: 'user' | 'admin'

  //

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @column.dateTime()
  declare deletedAt: DateTime | null
}
