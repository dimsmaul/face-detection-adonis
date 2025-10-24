import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Attendance from '#models/attendance'
import Log from '#models/log'
import vine from '@vinejs/vine'

export default class AttendancesController {
  /**
   * Display a list of attendances
   */
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const attendances = await Attendance.query()
      .preload('user')
      .orderBy('created_at', 'desc')
      .paginate(page, limit)

    return response.json(attendances)
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const validator = vine.compile(
      vine.object({
        userId: vine.string().uuid(),
        date: vine.string(),
        time: vine.string(),
        note: vine.string().optional(),
      })
    )

    const payload = await request.validateUsing(validator)

    const getValidateData = await Attendance.query()
      .where('user_id', request.input('userId'))
      .andWhere('date', payload.date)
      .first()

    if (getValidateData) {
      const attendance = await Attendance.findOrFail(getValidateData.id)
      attendance.merge({
        timeOut: payload.time,
      })
      await attendance.save()
      await attendance.load('user')
      return response.status(200).json(attendance)
    }
    const attendance = await Attendance.create({
      ...payload,
      date: DateTime.fromISO(payload.date),
    })

    // Log the attendance creation
    const now = DateTime.now()
    await Log.create({
      date: now,
      time: now.toFormat('HH:mm:ss'),
      title: 'attendances',
      note: `user_id:${payload.userId},action:create_attendance`,
    })

    await attendance.load('user')
    return response.status(201).json(attendance)
  }

  /**
   * Show individual attendance
   */
  async show({ params, response }: HttpContext) {
    const attendance = await Attendance.query().where('id', params.id).preload('user').firstOrFail()

    return response.json(attendance)
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    const attendance = await Attendance.findOrFail(params.id)

    const validator = vine.compile(
      vine.object({
        userId: vine.string().uuid().optional(),
        date: vine.string().optional(),
        time: vine.string().optional(),
        note: vine.string().optional(),
      })
    )

    const payload = await request.validateUsing(validator)
    const updateData = { ...payload }
    if (payload.date) {
      updateData.date = DateTime.fromISO(payload.date)
    }
    attendance.merge(updateData)
    await attendance.save()

    // Log the attendance update
    const now = DateTime.now()
    await Log.create({
      date: now,
      time: now.toFormat('HH:mm:ss'),
      title: 'attendances',
      note: `user_id:${attendance.userId},action:update_attendance`,
    })

    await attendance.load('user')
    return response.json(attendance)
  }

  /**
   * Delete attendance
   */
  async destroy({ params, response }: HttpContext) {
    const attendance = await Attendance.findOrFail(params.id)
    const userId = attendance.userId

    await attendance.delete()

    // Log the attendance deletion
    const now = DateTime.now()
    await Log.create({
      date: now,
      time: now.toFormat('HH:mm:ss'),
      title: 'attendances',
      note: `user_id:${userId},action:delete_attendance`,
    })

    return response.status(204).json({ message: 'Attendance deleted successfully' })
  }
}
