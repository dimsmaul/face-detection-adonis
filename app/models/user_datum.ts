import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Admin from './admin.js'

export default class UserDatum extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column.date()
  declare dob: DateTime | null

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

  @hasMany(() => User)
  declare users: HasMany<typeof User>

  @hasMany(() => Admin)
  declare admins: HasMany<typeof Admin>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
