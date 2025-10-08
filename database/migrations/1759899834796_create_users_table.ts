import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('full_name').nullable()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()

      table.string('nim').nullable()
      table.date('dob').nullable()
      table.string('profile').nullable()
      table.string('major').nullable()
      table.string('position').nullable() // Student, Lecturer, Staff
      table.integer('status').nullable()
      table.date('date_of_acceptance').nullable()
      table.string('address').nullable()
      table.string('phone').nullable()
      table.string('sub_district').nullable()
      table.string('city').nullable()
      table.string('province').nullable()
      table.string('postal_code').nullable()
      table.enum('role', ['user', 'admin']).defaultTo('user')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.timestamp('deleted_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
