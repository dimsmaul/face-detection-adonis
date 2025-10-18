import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Admin from './admin.js'
import { v4 as uuidv4 } from 'uuid'

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

  @belongsTo(() => User)
  declare users: BelongsTo<typeof User>

  @belongsTo(() => Admin)
  declare admins: BelongsTo<typeof Admin>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static assignUuid(data: UserDatum) {
    data.id = uuidv4()
  }
}
