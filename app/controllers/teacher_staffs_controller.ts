import Admin from '#models/admin'
import type { HttpContext } from '@adonisjs/core/http'

export default class TeacherStaffsController {
  async index({ request, response }: HttpContext) {
    const { page = 1, limit = 10, search = '' } = request.qs()

    try {
      const teacherStaffs = await Admin.query()
        .where('name', 'like', `%${search}%`)
        .orWhere('email', 'like', `%${search}%`)
        .paginate(page, limit)

      return response.ok({
        message: 'Teacher staffs fetched successfully',
        data: {
          items: teacherStaffs,
          meta: {
            total: teacherStaffs.total,
            perPage: teacherStaffs.perPage,
            currentPage: teacherStaffs.currentPage,
            lastPage: teacherStaffs.lastPage,
          },
        },
      })
    } catch (error) {
      response.unauthorized('You are not authorized to access this resource')
    }
  }

  async show({ params, response }: HttpContext) {
    const { id } = params

    try {
      const teacherStaff = await Admin.findOrFail(id)

      return response.ok({
        message: 'Teacher staff fetched successfully',
        data: teacherStaff,
      })
    } catch (error) {
      response.notFound('Teacher staff not found')
    }
  }

  async create({ request, response }: HttpContext) {
    const { name, email, password } = request.only(['name', 'email', 'password'])

    try {
      const teacherStaff = await Admin.create({ name, email, password })

      return response.created({
        message: 'Teacher staff created successfully',
        data: teacherStaff,
      })
    } catch (error) {
      response.badRequest('Failed to create teacher staff')
    }
  }
}
