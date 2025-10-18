import type { HttpContext } from '@adonisjs/core/http'
import Log from '#models/log'

export default class LogsController {
  /**
   * Display a list of logs
   */
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const logs = await Log.query()
      .orderBy('created_at', 'desc')
      .paginate(page, limit)

    return response.json(logs)
  }

  /**
   * Show individual log
   */
  async show({ params, response }: HttpContext) {
    const log = await Log.findOrFail(params.id)
    return response.json(log)
  }
}