import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'attendances'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').notNullable().primary()
      table.uuid('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.date('date').notNullable()
      table.time('time').nullable()
      table.time('time_out').nullable()
      table.string('note').nullable()

      table.integer('status').defaultTo(0)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
