import Attendance from '#models/attendance'
import Log from '#models/log'
import Permit from '#models/permit'
import Schedule from '#models/schedule'
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class UserViewsController {
  async dashboard({ auth, inertia }: HttpContext) {
    const date = DateTime.now()
    const attendance = await Attendance.query()
      .where('user_id', auth.user!.id)
      .andWhere('date', date.toISODate()!)
      .first()

    const permit = date.setZone('Asia/Jakarta')
    const leaveToday = await Permit.query().where('date', permit.toISODate()!).preload('user')
    const scheduled = await Schedule.query().where('date', date.toISODate()!).first()

    return inertia.render('users/dashboard/pages/index', {
      attendance,
      permit: leaveToday,
      scheduled,
    })
  }

  async attendance({ request, auth, inertia }: HttpContext) {
    const user = auth.user!
    const month = Number(request.input('month', DateTime.now().month)) // default: bulan sekarang
    const year = Number(request.input('year', DateTime.now().year)) // default: tahun sekarang

    // Ambil semua data attendance user di bulan & tahun itu
    const attendances = await Attendance.query()
      .where('user_id', user.id)
      .andWhereRaw('EXTRACT(MONTH FROM date) = ?', [month])
      .andWhereRaw('EXTRACT(YEAR FROM date) = ?', [year])
      .preload('user')
      .orderBy('date', 'asc')

    // Simpan ke map untuk akses cepat
    const attendanceMap = new Map(attendances.map((a) => [a.date.toISODate(), a]))

    // Generate semua tanggal di bulan tsb
    const start = DateTime.local(year, month, 1)
    const end = start.endOf('month')

    const days: any[] = []
    for (let day = start; day <= end; day = day.plus({ days: 1 })) {
      const existing = attendanceMap.get(day.toISODate())

      days.push({
        id: existing?.id ?? null,
        date: day.toFormat('yyyy-MM-dd'),
        status: existing?.status ?? 0,
        time: existing?.time ?? null,
        timeOut: existing?.timeOut ?? null,
        note: existing?.note ?? null,
      })
    }

    const sortingDaysDesc = days.sort((a, b) => (a.date < b.date ? 1 : -1))

    // Kirim ke Inertia
    return inertia.render('users/attendance/pages/index', {
      month,
      year,
      data: sortingDaysDesc,
    })
  }

  async leave({ inertia, auth }: HttpContext) {
    const leave = await Permit.query().where('user_id', auth.user!.id).orderBy('date', 'desc')
    return inertia.render('users/leave/pages/index', { leave })
  }

  async logs({ inertia, auth }: HttpContext) {
    const userlogs = await Log.query()
      .whereRaw(`note LIKE '%user_id:${auth.user!.id}%'`)
      .orderBy('date', 'desc')
    return inertia.render('users/logs/pages/index', { log: userlogs })
  }

  async profile({ inertia, auth }: HttpContext) {
    const users = await User.query().where('id', auth.user!.id).preload('userData').firstOrFail()
    return inertia.render('users/profile/pages/index', { user: users })
  }
}
