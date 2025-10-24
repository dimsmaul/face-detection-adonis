import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, beforeCreate } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import { v4 as uuidv4 } from 'uuid'

export default class Attendance extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare userId: string

  @column.date()
  declare date: DateTime

  @column()
  declare time: string

  @column()
  declare timeOut: string | null

  @column()
  declare note: string | null

  @column()
  declare status: number // 0: Pending, 1: Presence, 2: Leave, 3: Absent

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @beforeCreate()
  static assignUuid(data: Attendance) {
    data.id = uuidv4()
  }
}
