import Admin from '#models/admin'
import Position from '#models/position'
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class AdminViewsController {
  /**
   * @Feat Teacher & Staff Management
   */
  async list({ request, inertia }: HttpContext) {
    const { page = 1, limit = 10, search = '' } = request.qs()

    const data = await Admin.query()
      .where('name', 'like', `%${search}%`)
      .orWhere('email', 'like', `%${search}%`)
      .preload('position')
      .preload('userData')
      .orderBy('created_at', 'desc')
      .paginate(page, limit)

    // return response.ok({
    //   message: 'Teacher staffs fetched successfully',
    //   data: teacherStaffs,
    // })

    return inertia.render('admin/teacher-staff/pages/index', {
      data,
    })
  }

  async create({ inertia }: HttpContext) {
    const position = await Position.all()

    return inertia.render('admin/teacher-staff/pages/action', {
      position,
    })
  }

  /**
   * @Feat Position Management
   */

  async positionList({ request, inertia }: HttpContext) {
    const { page = 1, limit = 10, search = '' } = request.qs()

    const data = await Position.query()
      .where('name', 'like', `%${search}%`)
      .orderBy('created_at', 'desc')
      .paginate(page, limit)

    return inertia.render('admin/position/pages/index', {
      data,
    })
  }

  async createPosition({ inertia }: HttpContext) {
    return inertia.render('admin/position/pages/action')
  }

  async editPosition({ params, inertia }: HttpContext) {
    const position = await Position.findOrFail(params.id)

    return inertia.render('admin/position/pages/action', {
      position,
    })
  }

  /**
   * @Feat Student Management
   */
  async userList({ request, inertia }: HttpContext) {
    const { page = 1, limit = 10, search = '' } = request.qs()

    const data = await User.query()
      .where('name', 'like', `%${search}%`)
      .orWhere('email', 'like', `%${search}%`)
      .preload('userData')
      .orderBy('created_at', 'desc')
      .paginate(page, limit)

    return inertia.render('admin/student/pages/index', { data })
  }

  async createUser({ inertia }: HttpContext) {
    return inertia.render('admin/student/pages/action')
  }

  async editUser({ params, inertia }: HttpContext) {
    const user = await User.query().where('id', params.id).preload('userData').firstOrFail()

    return inertia.render('admin/student/pages/action', {
      user,
    })
  }
}
