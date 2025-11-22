import Schedule from '#models/schedule'
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class SchedulesController {
  async show({ params, response }: HttpContext) {
    const date = params.date
    const schedule = await User.query()
      .whereHas('attendances', (attendanceQuery) => {
        attendanceQuery.where('date', date)
      })
      .preload('attendances', (attendanceQuery) => {
        attendanceQuery.where('date', date)
      })
      .first()

    if (!schedule) {
      return response.status(404).json({ message: 'Schedule not found' })
    }
    return response.ok({
      message: 'Schedule fetched successfully',
      data: schedule,
    })
  }

  async store({ request, response }: HttpContext) {
    const body = request.only(['date', 'time', 'type'])

    // validate same date
    const existingSchedule = await Schedule.query().where('date', body.date).first()
    if (existingSchedule) {
      return response.status(400).json({ message: 'Schedule for this date already exists' })
    }

    const schedule = await Schedule.create(body)
    return response.created({
      message: 'Schedule created successfully',
      data: schedule,
    })
  }

  async update({ params, request, response }: HttpContext) {
    const body = request.only(['date', 'time', 'type'])

    const schedule = await Schedule.find(params.id)
    if (!schedule) {
      return response.status(404).json({ message: 'Schedule not found' })
    }

    // validate same date
    const existingSchedule = await Schedule.query()
      .where('date', body.date)
      .andWhere('id', '!=', params.id)
      .first()
    if (existingSchedule) {
      return response.status(400).json({ message: 'Schedule for this date already exists' })
    }
  }

  async destroy({ params, response }: HttpContext) {
    const schedule = await Schedule.find(params.id)
    if (!schedule) {
      return response.status(404).json({ message: 'Schedule not found' })
    }

    await schedule.delete()
    return response.ok({ message: 'Schedule deleted successfully' })
  }
}
