import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Notification from '#models/notification'
import Log from '#models/log'
import vine from '@vinejs/vine'
// import LoggingService from '#services/logging_service'

export default class NotificationsController {
  /**
   * Display a list of notifications
   */
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const notifications = await Notification.query()
      .orderBy('created_at', 'desc')
      .paginate(page, limit)

    return response.json(notifications)
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const validator = vine.compile(
      vine.object({
        message: vine.string(),
        nim: vine.string().optional(),
      })
    )

    const payload = await request.validateUsing(validator)
    const notification = await Notification.create(payload)

    // Log the notification creation
    const now = DateTime.now()
    await Log.create({
      date: now,
      time: now.toFormat('HH:mm:ss'),
      title: 'notifications',
      note: payload.nim ? `nim:${payload.nim},action:create_notification` : 'action:create_notification',
    })

    return response.status(201).json(notification)
  }

  /**
   * Show individual notification
   */
  async show({ params, response }: HttpContext) {
    const notification = await Notification.findOrFail(params.id)
    return response.json(notification)
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    const notification = await Notification.findOrFail(params.id)

    const validator = vine.compile(
      vine.object({
        message: vine.string().optional(),
        nim: vine.string().optional(),
      })
    )

    const payload = await request.validateUsing(validator)
    notification.merge(payload)
    await notification.save()

    // Log the notification update
    const now = DateTime.now()
    await Log.create({
      date: now,
      time: now.toFormat('HH:mm:ss'),
      title: 'notifications',
      note: notification.nim ? `nim:${notification.nim},action:update_notification` : 'action:update_notification',
    })

    return response.json(notification)
  }

  /**
   * Delete notification
   */
  async destroy({ params, response }: HttpContext) {
    const notification = await Notification.findOrFail(params.id)
    const userId = notification.nim ? parseInt(notification.nim) : undefined
    
    await notification.delete()

    // Log the notification deletion
    const now = DateTime.now()
    await Log.create({
      date: now,
      time: now.toFormat('HH:mm:ss'),
      title: 'notifications',
      note: notification.nim ? `nim:${notification.nim},action:delete_notification` : 'action:delete_notification',
    })

    return response.status(204).json({ message: 'Notification deleted successfully' })
  }
}