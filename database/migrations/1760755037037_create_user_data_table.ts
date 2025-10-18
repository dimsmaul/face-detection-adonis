import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_data'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').notNullable().primary()

      table.date('dob').nullable()
      table.string('address').nullable()
      table.string('phone').nullable()
      table.string('sub_district').nullable()
      table.string('city').nullable()
      table.string('province').nullable()
      table.string('postal_code').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
