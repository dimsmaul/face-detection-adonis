import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').notNullable().primary()

      table.string('nim').nullable()
      table.string('name').nullable()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()

      table.string('major').nullable()
      table.integer('status').nullable()
      table.date('date_of_acceptance').nullable()
      table.string('profile').nullable()

      table
        .uuid('user_data_id')
        .nullable()
        .references('id')
        .inTable('user_data')
        .defaultTo(null)
        .onDelete('SET NULL')

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()

      table.timestamp('deleted_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
