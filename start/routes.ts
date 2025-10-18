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
const AttendancesController = () => import('#controllers/attendances_controller')
const PermitsController = () => import('#controllers/permits_controller')
const LogsController = () => import('#controllers/logs_controller')
const NotificationsController = () => import('#controllers/notifications_controller')

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

// API Routes
router.group(() => {
  // Attendances CRUD
  router.get('/attendances', [AttendancesController, 'index'])
  router.post('/attendances', [AttendancesController, 'store'])
  router.get('/attendances/:id', [AttendancesController, 'show'])
  router.put('/attendances/:id', [AttendancesController, 'update'])
  router.delete('/attendances/:id', [AttendancesController, 'destroy'])

  // Permits CRUD
  router.get('/permits', [PermitsController, 'index'])
  router.post('/permits', [PermitsController, 'store'])
  router.get('/permits/:id', [PermitsController, 'show'])
  router.put('/permits/:id', [PermitsController, 'update'])
  router.delete('/permits/:id', [PermitsController, 'destroy'])

  // Logs (Read-only - logs are created automatically by system)
  router.get('/logs', [LogsController, 'index'])
  router.get('/logs/:id', [LogsController, 'show'])

  // Notifications CRUD
  router.get('/notifications', [NotificationsController, 'index'])
  router.post('/notifications', [NotificationsController, 'store'])
  router.get('/notifications/:id', [NotificationsController, 'show'])
  router.put('/notifications/:id', [NotificationsController, 'update'])
  router.delete('/notifications/:id', [NotificationsController, 'destroy'])
}).prefix('/api').use(middleware.auth({ guards: ['web'] }))
