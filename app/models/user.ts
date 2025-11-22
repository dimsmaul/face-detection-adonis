import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import {
  BaseModel,
  column,
  hasMany,
  beforeCreate,
  belongsTo,
  manyToMany,
} from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import UserDatum from './user_datum.js'
import type { HasMany, BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import { v4 as uuidv4 } from 'uuid'
import Attendance from './attendance.js'
import Permit from './permit.js'
import Schedule from './schedule.js'
// import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
// import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
// import type { HasMany } from '@adonisjs/lucid/types/relations'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: string

  @column({ columnName: 'user_data_id' })
  declare userDataId: string | null

  @column()
  declare nim: string | null

  @column()
  declare name: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare major: string | null

  @column()
  declare status: number | null

  @column.dateTime()
  declare dateOfAcceptance: DateTime | null

  @column()
  declare profile: string | null

  @belongsTo(() => UserDatum, { foreignKey: 'userDataId' })
  declare userData: BelongsTo<typeof UserDatum>

  @hasMany(() => Attendance, { foreignKey: 'userId' })
  declare attendances: HasMany<typeof import('./attendance.js').default>

  @hasMany(() => Permit, { foreignKey: 'userId' })
  declare permits: HasMany<typeof import('./permit.js').default>

  // @manyToMany(() => Schedule, {
  //   pivotTable: 'attendances',
  //   localKey: 'id',
  //   pivotForeignKey: 'user_id',
  //   relatedKey: 'id',
  //   pivotRelatedForeignKey: 'service_id',
  // })
  // declare schedules: ManyToMany<typeof Schedule>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @column.dateTime()
  declare deletedAt: DateTime | null

  @beforeCreate()
  static assignUuid(user: User) {
    user.id = uuidv4()
  }
}
