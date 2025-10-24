import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AdminAuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const adminAuth = ctx.auth.use('admin')
    /**
     * Middleware logic goes here (before the next call)
     */
    // console.log(ctx)
    if ((await adminAuth.check()) === false) {
      return ctx.response.redirect('/')
    }

    // Shared Inertia data
    ctx.inertia.share({
      auth: {
        user: adminAuth.user ? adminAuth.user?.serialize() : null,
      },
    })

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}
