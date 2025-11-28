import Admin from '#models/admin'
import Attendance from '#models/attendance'
import Permit from '#models/permit'
import Position from '#models/position'
import Schedule from '#models/schedule'
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class AdminViewsController {
  /**
   * @Feat Dashboard
   */

  async dashboard({ inertia }: HttpContext) {
    const date = DateTime.now()
    const permit = date.setZone('Asia/Jakarta')
    const leaveToday = await Permit.query().where('date', permit.toISODate()!).preload('user')

    // compare presence with absent today
    // const attendanceToday = await Attendance.query().where('date', permit.toISODate()!)
    const userPresence = await User.query()
      .preload('attendances', (attendanceQuery) => {
        attendanceQuery.where('date', permit.toISODate()!)
      })
      .preload('permits', (permitQuery) => {
        permitQuery.where('date', permit.toISODate()!)
      })

    const present = userPresence.filter((u) => u.attendances.length > 0).length
    const leave = userPresence.filter((u) => u.permits.length > 0).length

    const compare = {
      present,
      leave,
      absent: userPresence.length - (present + leave),
    }

    // prensence report per-month in this year
    const year = date.year
    const monthlyPresence = await Attendance.query()
      .whereRaw('EXTRACT(YEAR FROM date) = ?', [year])
      .select(Attendance.query().client.raw('EXTRACT(MONTH FROM date) AS month'))
      .count('* AS count')
      .groupByRaw('EXTRACT(MONTH FROM date)')
      .orderByRaw('EXTRACT(MONTH FROM date) ASC')

    const monthlyData: { month: number; count: number }[] = []
    for (let month = 1; month <= 12; month++) {
      const monthData = monthlyPresence.find((m) => Number(m.$extras.month) === month)
      monthlyData.push({
        month,
        count: monthData ? Number(monthData.$extras.count) : 0,
      })
    }

    return inertia.render('admin/dashboard/pages/index', {
      permit: leaveToday,
      compare,
      monthlyData,
    })
  }

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

  async edit({ params, inertia }: HttpContext) {
    const { id } = params
    const admin = await Admin.query().where('id', id).preload('userData').firstOrFail()
    const position = await Position.all()

    return inertia.render('admin/teacher-staff/pages/action', {
      admin,
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
    const schedule = await Schedule.query().where('date', date).firstOrFail()

    const user = await User.query()
      .preload('attendances', (attendanceQuery) => {
        attendanceQuery.where('date', date)
      })
      .preload('permits', (permitQuery) => {
        permitQuery.where('date', date)
      })
      .orderBy('name', 'asc')

    return inertia.render('admin/schedule/pages/detail', { data: user, schedule })
  }

  /**
   * @Feat Profile Management
   */
  async profile({ inertia, auth }: HttpContext) {
    const admin = await Admin.query()
      .where('id', auth.user!.id)
      .preload('position')
      .preload('userData')
      .firstOrFail()

    return inertia.render('admin/profile/pages/index', {
      data: admin,
    })
  }
}
