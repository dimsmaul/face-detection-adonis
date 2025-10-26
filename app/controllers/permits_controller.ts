import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Permit from '#models/permit'
import Log from '#models/log'
import vine from '@vinejs/vine'
import { readFileSync } from 'node:fs'
import { SupabaseStorageService } from '#services/supabase_service'

export default class PermitsController {
  private supabase = new SupabaseStorageService()
  /**
   * Display a list of permits
   */
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const permits = await Permit.query()
      .preload('user')
      .orderBy('created_at', 'desc')
      .paginate(page, limit)

    return response.json(permits)
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, auth, response }: HttpContext) {
    const validator = vine.compile(
      vine.object({
        date: vine.string(),
        time: vine.string(),
        note: vine.string().optional(),
        attachment: vine.any().optional(),
      })
    )

    const file = request.file('attachment')

    let fileUrl: string | null = null
    if (file) {
      const buffer = readFileSync(file.tmpPath!)
      const uploaded = await this.supabase.uploadFile(buffer, 'permit', file.extname!)
      fileUrl = uploaded.url
    }

    const payload = await request.validateUsing(validator)
    const permit = await Permit.create({
      ...payload,
      userId: auth.user!.id,
      date: DateTime.fromISO(payload.date),
      attachment: fileUrl,
    })

    // Log the permit request
    const now = DateTime.now()
    await Log.create({
      date: now,
      time: now.toFormat('HH:mm:ss'),
      title: 'permits',
      note: `user_id:${auth.user?.id},action:request_permit`,
    })

    await permit.load('user')
    return response.status(201).json(permit)
  }

  /**
   * Show individual permit
   */
  async show({ params, response }: HttpContext) {
    const permit = await Permit.query().where('id', params.id).preload('user').firstOrFail()

    return response.json(permit)
  }

  /**
   * Handle form submission for the edit action
   */
  async update({}: HttpContext) {
    // const permit = await Permit.findOrFail(params.id)

    // const validator = vine.compile(
    //   vine.object({
    //     userId: vine.number().optional(),
    //     date: vine.string().optional(),
    //     time: vine.string().optional(),
    //     note: vine.string().optional(),
    //     attachment: vine.string().optional(),
    //   })
    // )

    // const payload = await request.validateUsing(validator)
    // const updateData = { ...payload }
    // if (payload.date) {
    //   updateData.date = DateTime.fromISO(payload.date)
    // }
    // permit.merge(updateData)
    // await permit.save()

    // // Log the permit update
    // const now = DateTime.now()
    // await Log.create({
    //   date: now,
    //   time: now.toFormat('HH:mm:ss'),
    //   title: 'permits',
    //   note: `user_id:${permit.userId},action:update_permit`,
    // })

    // await permit.load('user')
    // return response.json(permit)
    return {}
  }

  /**
   * Delete permit
   */
  async destroy({ params, response }: HttpContext) {
    const permit = await Permit.findOrFail(params.id)
    const userId = permit.userId

    await permit.delete()

    // Log the permit deletion
    const now = DateTime.now()
    await Log.create({
      date: now,
      time: now.toFormat('HH:mm:ss'),
      title: 'permits',
      note: `user_id:${userId},action:delete_permit`,
    })

    return response.status(204).json({ message: 'Permit deleted successfully' })
  }
}
