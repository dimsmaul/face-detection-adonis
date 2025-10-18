import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { useEffect, useState } from 'react'
import { AppSidebar } from '~/components/sidebars'

export default function Dashboard({ children }: { children: React.ReactNode }) {
  const location = window.location.pathname

  const [breadcrumbs, setBreadcrumbs] = useState<{ name: string; url: string }[]>([])

  useEffect(() => {
    const pathSegments = location.split('/').filter(Boolean)
    const breadcrumbItems = pathSegments
      .filter((item) => item !== 'admin')
      .map((segment, index) => {
        const url = `/${pathSegments.slice(0, index + 1).join('/')}`
        return { name: segment, url }
      })
    setBreadcrumbs(breadcrumbItems)
  }, [location])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((breadcrumb, index) => (
                  <>
                    <BreadcrumbItem key={index}>
                      {index < breadcrumbs.length - 1 ? (
                        <BreadcrumbLink href={breadcrumb.url}>
                          {breadcrumb.name.charAt(0).toUpperCase() + breadcrumb.name.slice(1)}
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage>
                          {breadcrumb.name.charAt(0).toUpperCase() + breadcrumb.name.slice(1)}
                        </BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                    {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                  </>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
          {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div>
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" /> */}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
