import Admin from '#models/admin'
import Log from '#models/log'
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class SessionController {
  async store({ request, auth, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])
    const date = DateTime.now().setZone('Asia/Jakarta')

    try {
      try {
        const admin = await Admin.verifyCredentials(email, password)
        await auth.use('admin').login(admin)
        // insert logs
        Log.create({
          time: date.toFormat('HH:mm:ss'),
          date: date,
          title: 'Login',
          note: `user_id:${admin.id},action:login`,
        })
        // console.log('Admin logged in')
        // return response.redirect().toPath('/admin/dashboard')
        return response.ok({ redirect: '/admin/dashboard' })
      } catch {
        // Jika gagal, lanjut coba sebagai user
        const user = await User.verifyCredentials(email, password)
        const userActive = user.status
        if (userActive !== 1) {
          return response.unauthorized('User is not active, please contact administrator.')
          // return response.internalServerError('User is not active')
        }
        await auth.use('web').login(user)
        // insert logs
        Log.create({
          time: date.toFormat('HH:mm:ss'),
          date: date,
          title: 'Login',
          note: `user_id:${user.id},action:login`,
        })
        // console.log('User logged in')
        // return response.redirect().toPath('/dashboard')
        return response.ok({ redirect: '/dashboard' })
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

  async logout({ auth, response }: HttpContext) {
    const isAdmin = await auth.use('admin').check()
    const date = DateTime.now().setZone('Asia/Jakarta')
    Log.create({
      time: date.toFormat('HH:mm:ss'),
      date: date,
      title: 'Logout',
      note: `user_id:${auth.user?.id},action:logout`,
    })
    if (isAdmin) {
      await auth.use('admin').logout()
      // insert logs
    } else {
      await auth.use('web').logout()
    }

    return response.redirect().toPath('/')
  }
}
