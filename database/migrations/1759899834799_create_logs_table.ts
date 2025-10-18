import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'logs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.date('date').notNullable()
      table.time('time').notNullable()
      table.string('title').notNullable() // table name (attendances, permits, notifications)
      table.string('note').notNullable() // action like {user_id}.create_attendance, {user_id}.request_permit

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}