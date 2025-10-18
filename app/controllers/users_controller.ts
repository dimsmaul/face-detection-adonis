import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  async index({ request, response }: HttpContext) {
    const { page = 1, limit = 10, search = '' } = request.qs()

    try {
      const users = await User.query()
        .where('name', 'like', `%${search}%`)
        .orWhere('email', 'like', `%${search}%`)
        .preload('userData')
        .orderBy('created_at', 'desc')
        .paginate(page, limit)

      return response.ok({
        message: 'Users fetched successfully',
        data: users,
      })
    } catch (error) {
      response.unauthorized('You are not authorized to access this resource')
    }
  }

  async show({ params, response }: HttpContext) {
    const { id } = params

    try {
      const user = await User.query().where('id', id).preload('userData').firstOrFail()

      return response.ok({
        message: 'User fetched successfully',
        data: user,
      })
    } catch (error) {
      response.notFound('User not found')
    }
  }

  async store({ request, response }: HttpContext) {
    const { nim, name, email, password, major, status, dateOfAcceptance, profile } = request.only([
      'nim',
      'name',
      'email',
      'password',
      'major',
      'status',
      'dateOfAcceptance',
      'profile',
    ])

    try {
      const user = await User.create({
        nim,
        name,
        email,
        password,
        major,
        status,
        dateOfAcceptance,
        profile,
      })

      return response.created({
        message: 'User created successfully',
        data: user,
      })
    } catch (error) {
      response.badRequest('Failed to create user')
    }
  }

  async update({ params, request, response }: HttpContext) {
    const { id } = params
    const { nim, name, email, password, major, status, dateOfAcceptance, profile } = request.only([
      'nim',
      'name',
      'email',
      'password',
      'major',
      'status',
      'dateOfAcceptance',
      'profile',
    ])

    try {
      const user = await User.findOrFail(id)

      user.merge({
        nim,
        name,
        email,
        password,
        major,
        status,
        dateOfAcceptance,
        profile,
      })

      await user.save()

      return response.ok({
        message: 'User updated successfully',
        data: user,
      })
    } catch (error) {
      response.notFound('User not found')
    }
  }

  async destroy({ params, response }: HttpContext) {
    const { id } = params
    try {
      const user = await User.findOrFail(id)
      await user.delete()

      return response.ok({
        message: 'User deleted successfully',
      })
    } catch (error) {
      response.notFound('User not found')
    }
  }
}
