import Admin from '#models/admin'
import Position from '#models/position'
import Schedule from '#models/schedule'
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

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

  /**
   * @Feat Schedule Management
   */
  async scheduleList({ inertia, request }: HttpContext) {
    const month = Number(request.input('month', DateTime.now().month)) // default: bulan sekarang
    const year = Number(request.input('year', DateTime.now().year)) // default: tahun sekarang

    const data = await Schedule.query()
      .whereRaw('EXTRACT(MONTH FROM date) = ?', [month])
      .andWhereRaw('EXTRACT(YEAR FROM date) = ?', [year])
      .orderBy('created_at', 'asc')

    return inertia.render('admin/schedule/pages/index', { data })
  }

  async scheduleDetail({ params, inertia }: HttpContext) {
    const date = params.date
    const schedule = await User.query()
      // .whereHas('attendances', (attendanceQuery) => {
      //   attendanceQuery.where('date', date)
      // })
      .preload('attendances', (attendanceQuery) => {
        attendanceQuery.where('date', date)
      })
    return inertia.render('admin/schedule/pages/detail', { data: schedule })
  }
}
