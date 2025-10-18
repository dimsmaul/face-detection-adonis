import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'admins'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').notNullable().primary()

      table.string('nip').nullable()
      table.string('name').nullable()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()

      table.string('subject').nullable()
      table.integer('status').nullable()
      table.string('profile').nullable()

      table.uuid('role_id').nullable().references('id').inTable('roles').onDelete('SET NULL')
      table
        .uuid('user_data_id')
        .nullable()
        .references('id')
        .inTable('user_data')
        .onDelete('SET NULL')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
