import Attendance from '#models/attendance'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class UserViewsController {
  async dashboard({ auth, inertia }: HttpContext) {
    const date = DateTime.now()
    const attendance = await Attendance.query()
      .where('user_id', auth.user!.id)
      .andWhere('date', date.toISODate()!)
      .first()
    return inertia.render('users/dashboard/pages/index', { attendance })
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

    // Kirim ke Inertia
    return inertia.render('users/attendance/pages/index', {
      month,
      year,
      data: days,
    })
  }

  async leave({ auth, inertia }: HttpContext) {
    return inertia.render('users/leave/pages/index')
  }

  async logs({ auth, inertia }: HttpContext) {
    return inertia.render('users/logs/pages/index')
  }
}
