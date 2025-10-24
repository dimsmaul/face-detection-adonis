import Position from '#models/position'
import type { HttpContext } from '@adonisjs/core/http'

export default class PositionsController {
  async index({ request, response }: HttpContext) {
    const { page = 1, limit = 10, search = '' } = request.qs()

    const positions = await Position.query()
      .where('name', 'like', `%${search}%`)
      .orderBy('created_at', 'desc')
      .paginate(page, limit)

    return response.ok({
      message: 'Positions fetched successfully',
      data: positions,
    })
  }

  async show({ params, response }: HttpContext) {
    const { id } = params

    try {
      const position = await Position.query().where('id', id).firstOrFail()

      return response.ok({
        message: 'Position fetched successfully',
        data: position,
      })
    } catch (error) {
      response.notFound('Position not found')
    }
  }

  async store({ request, response }: HttpContext) {
    const { name } = request.only(['name'])

    try {
      const position = await Position.create({ name })

      return response.created({
        message: 'Position created successfully',
        data: position,
      })
    } catch (error) {
      response.badRequest('Failed to create position')
    }
  }

  async update({ params, request, response }: HttpContext) {
    const { id } = params
    const { name } = request.only(['name'])

    try {
      const position = await Position.findOrFail(id)
      position.name = name
      await position.save()

      return response.ok({
        message: 'Position updated successfully',
        data: position,
      })
    } catch (error) {
      response.notFound('Position not found')
    }
  }

  async destroy({ params, response }: HttpContext) {
    const { id } = params
    try {
      const position = await Position.findOrFail(id)
      await position.delete()

      return response.ok({
        message: 'Position deleted successfully',
      })
    } catch (error) {
      response.notFound('Position not found')
    }
  }
}
