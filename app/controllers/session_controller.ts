import Admin from '#models/admin'
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class SessionController {
  async store({ request, auth, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])
    try {
      const user = await User.verifyCredentials(email, password)
      const admin = await Admin.verifyCredentials(email, password)

      if (!user && !admin) {
        throw new Error('Invalid credentials')
      }

      if (admin) {
        await auth.use('admin').login(admin)
        return response.redirect().toPath('/admin/dashboard')
      } else {
        await auth.use('web').login(user)
        return response.redirect().toPath('/dashboard')
      }

      // await auth.use('web').login(user)
      // response.redirect().toPath('/dashboard')
    } catch (error) {
      response.redirect().back()
    }
  }

  async register({ request, response }: HttpContext) {
    const { email, password, name } = request.only(['email', 'password', 'name'])
    try {
      await User.create({ email, password, name })
      response.redirect().toPath('/')
    } catch (error) {
      response.redirect().back()
    }
  }
}
