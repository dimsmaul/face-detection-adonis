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
const AdminsController = () => import('#controllers/admins_controller')
const UsersController = () => import('#controllers/users_controller')
const PositionsController = () => import('#controllers/positions_controller')
const UserDataController = () => import('#controllers/user_data_controller')
const AttendancesController = () => import('#controllers/attendances_controller')
const PermitsController = () => import('#controllers/permits_controller')
const LogsController = () => import('#controllers/logs_controller')
const NotificationsController = () => import('#controllers/notifications_controller')

/**
 * @Import Render View
 */
const AdminViewsController = () => import('#controllers/admin_views_controller')
const UserViewsController = () => import('#controllers/user_views_controller')

/**
 * @Feat Authentication Routes
 */
router.on('/').renderInertia('auth/pages/sign-in').as('sign-in').use(middleware.guest())
router.post('/sign-in', [SessionController, 'store']).as('sign-in.post')

// Sign Up
router.on('/sign-up').renderInertia('auth/pages/sign-up').as('sign-up').use(middleware.guest())
router.post('/sign-up', [SessionController, 'register']).as('sign-up.post')

// Sign Out
router
  .post('/sign-out', [SessionController, 'logout'])
  .as('sign-out')
  .use(middleware.auth({ guards: ['web', 'admin'] }))

/**
 * @Feat Dashboard User
 */

router
  .group(() => {
    router.get('/dashboard', [UserViewsController, 'dashboard'])
    router.get('/attendance', [UserViewsController, 'attendance'])
    router.get('/leave', [UserViewsController, 'leave'])
    router.get('/logs', [UserViewsController, 'logs'])
  })
  .use(middleware.auth({ guards: ['web'] }))

/**
 * @Feat Dashboard Admin
 */

router
  .group(() => {
    router.on('/dashboard').renderInertia('admin/dashboard/pages/index').as('admin.dashboard')

    /**
     * @Feat Admin Teacher & Staff Management
     */
    router.get('/teachers-staff', [AdminViewsController, 'list'])
    router.get('/teachers-staff/action', [AdminViewsController, 'create'])

    /**
     * @Feat Admin Position Management
     */
    router.get('/positions', [AdminViewsController, 'positionList'])
    router.get('/positions/action', [AdminViewsController, 'createPosition'])
    router.get('/positions/action/:id', [AdminViewsController, 'editPosition'])
    // router.get('/positions/action', [AdminViewsController, 'create'])

    /**
     * @Feat Admin Student Management
     */
    router.get('/students', [AdminViewsController, 'userList'])
    router.get('/students/action', [AdminViewsController, 'createUser'])
    router.get('/students/action/:id', [AdminViewsController, 'editUser'])
  })
  .prefix('/admin')
  .use(middleware.auth({ guards: ['admin'] }))

/**
 * @Feat API Routes
 */
router
  .group(() => {
    // User CRUD
    router.get('/users', [UsersController, 'index'])
    router.post('/users', [UsersController, 'store'])
    router.get('/users/:id', [UsersController, 'show'])
    router.put('/users/:id', [UsersController, 'update'])
    router.delete('/users/:id', [UsersController, 'destroy'])

    // Admin CRUD
    router.get('/admin', [AdminsController, 'index'])
    router.post('/admin', [AdminsController, 'store'])
    router.get('/admin/:id', [AdminsController, 'show'])
    router.put('/admin/:id', [AdminsController, 'update'])
    router.delete('/admin/:id', [AdminsController, 'destroy'])

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
  // .use(middleware.admin())
  // .middleware(['auth:admin'])
  .use(middleware.auth({ guards: ['web', 'admin'] }))
// .use(middleware.admin())
