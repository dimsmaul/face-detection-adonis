import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'attendances'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').notNullable().primary()
      table.date('date').notNullable()
      table.time('time').nullable()
      table.time('time_out').nullable()
      table.string('note').nullable()

      table.integer('status').defaultTo(0)

      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.integer('schedule_id').references('id').inTable('schedules').onDelete('CASCADE')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
