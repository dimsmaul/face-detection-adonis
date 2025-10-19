import Admin from '#models/admin'
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class SessionController {
  async store({ request, auth, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    try {
      try {
        const admin = await Admin.verifyCredentials(email, password)
        await auth.use('admin').login(admin)
        // console.log('Admin logged in')
        return response.redirect().toPath('/admin/dashboard')
      } catch {
        // Jika gagal, lanjut coba sebagai user
        const user = await User.verifyCredentials(email, password)
        await auth.use('web').login(user)
        // console.log('User logged in')
        return response.redirect().toPath('/dashboard')
      }
    } catch (error) {
      console.log('Login failed:', error.message)
      return response.redirect().back()
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
