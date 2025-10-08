/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const SessionController = () => import('#controllers/session_controller')

// NOTE: Auth
// Sign In
router.on('/').renderInertia('auth/pages/sign-in').as('sign-in').use(middleware.guest())
router.post('/', [SessionController, 'store']).as('sign-in.post')

// Sign Up
router.on('/sign-up').renderInertia('auth/pages/sign-up').as('sign-up').use(middleware.guest())
router.post('/sign-up', [SessionController, 'register']).as('sign-up.post')

// Dashboard
router
  .on('/dashboard')
  .renderInertia('dashboard/pages/dashboard')
  .as('dashboard')
  .use(
    middleware.auth({
      guards: ['web'],
    })
  )
