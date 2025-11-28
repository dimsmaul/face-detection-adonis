import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, hasMany } from '@adonisjs/lucid/orm'
import { v4 as uuidv4 } from 'uuid'
import * as relations from '@adonisjs/lucid/types/relations'
import Attendance from './attendance.js'

export default class Schedule extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare date: DateTime

  @column()
  declare time: string

  @column()
  declare type: 'holiday' | 'scheduled'

  // @manyToMany(() => User, {
  //   pivotTable: 'attendances',
  //   localKey: 'id',
  //   pivotForeignKey: 'schedule_id',
  //   relatedKey: 'id',
  //   pivotRelatedForeignKey: 'service_id',
  // })
  // declare services: relations.ManyToMany<typeof User>
  @hasMany(() => Attendance, { foreignKey: 'scheduleId' })
  declare attendances: relations.HasMany<typeof Attendance>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // @beforeCreate()
  // static assignUuid(data: Schedule) {
  //   data.id = uuidv4()
  // }
}
