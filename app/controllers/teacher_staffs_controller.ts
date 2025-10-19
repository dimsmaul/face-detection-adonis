import Admin from '#models/admin'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

export default class TeacherStaffsController {
  async index({ request, response }: HttpContext) {
    const { page = 1, limit = 10, search = '' } = request.qs()

    try {
      const teacherStaffs = await Admin.query()
        .where('name', 'like', `%${search}%`)
        .orWhere('email', 'like', `%${search}%`)
        .preload('position')
        .orderBy('created_at', 'desc')
        .paginate(page, limit)

      return response.ok({
        message: 'Teacher staffs fetched successfully',
        data: teacherStaffs,
      })

      // return inertia.render('admin/teacher-staff/pages/index', {
      //   teacherStaffs,
      //   search,
      //   page,
      //   limit,
      // })
    } catch (error) {
      response.unauthorized('You are not authorized to access this resource')
    }
  }

  async show({ params, response }: HttpContext) {
    const { id } = params

    try {
      const teacherStaff = await Admin.query().where('id', id).preload('position').firstOrFail()

      return response.ok({
        message: 'Teacher staff fetched successfully',
        data: teacherStaff,
      })
    } catch (error) {
      response.notFound('Teacher staff not found')
    }
  }

  async store({ request, response }: HttpContext) {
    const validator = vine.compile(
      vine.object({
        nip: vine.string().optional(),
        name: vine.string().optional(),
        email: vine.string().email(),
        password: vine.string().minLength(6),
        subject: vine.string().optional(),
        status: vine.number().optional(),
        positionId: vine.string().uuid(),
      })
    )

    try {
      const payload = await request.validateUsing(validator)
      const teacherStaff = await Admin.create({
        ...payload,
      })

      return response.created({
        message: 'Teacher staff created successfully',
        data: teacherStaff,
      })
    } catch (error) {
      response.badRequest('Failed to create teacher staff')
    }
  }

  async update({ params, request, response }: HttpContext) {
    const { id } = params
    const validator = vine.compile(
      vine.object({
        nip: vine.string().optional(),
        name: vine.string().optional(),
        email: vine.string().email().optional(),
        password: vine.string().minLength(6).optional(),
        subject: vine.string().optional(),
        status: vine.number().optional(),
        roleId: vine.string().uuid().optional(),
      })
    )

    try {
      const teacherStaff = await Admin.findOrFail(id)

      const payload = await request.validateUsing(validator)
      teacherStaff.merge({
        ...payload,
      })

      await teacherStaff.save()

      return response.ok({
        message: 'Teacher staff updated successfully',
        data: teacherStaff,
      })
    } catch (error) {
      response.notFound('Teacher staff not found')
    }
  }

  async destroy({ params, response }: HttpContext) {
    const { id } = params

    try {
      const teacherStaff = await Admin.findOrFail(id)
      await teacherStaff.delete()

      return response.ok({
        message: 'Teacher staff deleted successfully',
      })
    } catch (error) {
      response.notFound('Teacher staff not found')
    }
  }
}
