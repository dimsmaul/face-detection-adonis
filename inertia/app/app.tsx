/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/inertia.ts" />

import '../css/app.css'
import { createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
// import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import Dashboard from '~/layouts/dashboard'
import NoLayouts from '~/layouts/no-layout'

const appName = import.meta.env.VITE_APP_NAME || 'AdonisJS'

createInertiaApp({
  progress: { color: '#5468FF' },

  title: (title) => `${title} - ${appName}`,

  resolve: (name) => {
    // return resolvePageComponent(
    //   `../pages/${name}.tsx`,
    //   import.meta.glob('../pages/**/*.tsx'),
    // )
    const pages = import.meta.glob('../pages/**/*.tsx', { eager: true })
    const page: any = pages[`../pages/${name}.tsx`]

    if (!page) {
      console.error(`Page not found: ${name}`)
      throw new Error(`Page not found: ${name}`)
    }

    // alert(name.startsWith('admin'));
    // Tentukan layout otomatis berdasarkan folder parent
    if (name.startsWith('admin')) {
      page.default.layout = (page: any) => <Dashboard>{page}</Dashboard>
    } else if (name.startsWith('dashboard')) {
      page.default.layout = (page: any) => <Dashboard>{page}</Dashboard>
    } else {
      page.default.layout = (page: any) => <NoLayouts>{page}</NoLayouts>
    }

    return page
  },

  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />)
  },
})
