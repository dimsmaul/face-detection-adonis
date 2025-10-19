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
const TeacherStaffsController = () => import('#controllers/teacher_staffs_controller')
const UsersController = () => import('#controllers/users_controller')
const PositionsController = () => import('#controllers/positions_controller')
const UserDataController = () => import('#controllers/user_data_controller')
const AttendancesController = () => import('#controllers/attendances_controller')
const PermitsController = () => import('#controllers/permits_controller')
const LogsController = () => import('#controllers/logs_controller')
const NotificationsController = () => import('#controllers/notifications_controller')

// NOTE: Auth
// Sign In
router.on('/').renderInertia('auth/pages/sign-in').as('sign-in').use(middleware.guest())
router.post('/sign-in', [SessionController, 'store']).as('sign-in.post')

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

router
  .group(() => {
    router.on('/dashboard').renderInertia('admin/dashboard/pages/index').as('admin.dashboard')

    /**
     * @Feat Admin Teacher & Staff Management
     */
    router
      .on('/teachers-staff/')
      .renderInertia('admin/teacher-staff/pages/index')
      .as('admin.teacher-staff')
    // router
    //   .on('/teachers-staff/')
    //   .renderInertia('admin/teacher-staff/pages/index')
    //   .as('admin.teacher-staff')
  })
  .prefix('/admin')
  .use(middleware.admin())

// API Routes
router
  .group(() => {
    // User CRUD
    router.get('/users', [UsersController, 'index'])
    router.post('/users', [UsersController, 'store'])
    router.get('/users/:id', [UsersController, 'show'])
    router.put('/users/:id', [UsersController, 'update'])
    router.delete('/users/:id', [UsersController, 'destroy'])

    // Admin CRUD
    router.get('/admin', [TeacherStaffsController, 'index'])
    router.post('/admin', [TeacherStaffsController, 'store'])
    router.get('/admin/:id', [TeacherStaffsController, 'show'])
    router.put('/admin/:id', [TeacherStaffsController, 'update'])
    router.delete('/admin/:id', [TeacherStaffsController, 'destroy'])

    // Position
    router.get('/positions', [PositionsController, 'index'])
    router.post('/positions', [PositionsController, 'store'])
    router.get('/positions/:id', [PositionsController, 'show'])
    router.put('/positions/:id', [PositionsController, 'update'])
    router.delete('/positions/:id', [PositionsController, 'destroy'])

    // User Data
    router.get('/user-data', [UserDataController, 'create'])
    router.post('/user-data', [UserDataController, 'update'])

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
  })
  .prefix('/api')
  // .middleware(['auth:admin'])
  .use(middleware.auth({ guards: ['web', 'admin'] }))
// .use(middleware.admin())
