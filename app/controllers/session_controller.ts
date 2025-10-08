import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class SessionController {
  async store({ request, auth, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])
    try {
      const user = await User.verifyCredentials(email, password)
      await auth.use('web').login(user)
      response.redirect().toPath('/dashboard')
    } catch (error) {
      response.redirect().back()
    }
  }

  async register({ request, response }: HttpContext) {
    const { email, password, fullName } = request.only(['email', 'password', 'fullName'])
    try {
      await User.create({ email, password, fullName })
      response.redirect().toPath('/')
    } catch (error) {
      response.redirect().back()
    }
  }
}
