'use client'

import * as React from 'react'
import {
  AudioWaveform,
  BookMarked,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  LayoutDashboard,
  Map,
  Pen,
  PieChart,
  School,
  Settings2,
  SquareTerminal,
  Users,
} from 'lucide-react'

// import { NavMain } from "@/components/nav-main"
// import { NavProjects } from "@/components/nav-projects"
// import { NavUser } from "@/components/nav-user"
// import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { NavProjects } from './nav-project'

// This is sample data.
const data = {
  projects: [
    {
      name: 'Dashboard',
      url: '/admin/dashboard',
      icon: LayoutDashboard,
    },
  ],
  students: [
    {
      name: 'Student List',
      url: '/admin/students',
      icon: School,
    },
    {
      name: 'Attendance Records',
      url: '/admin/attendance-records',
      icon: BookMarked,
    },
  ],
  admin: [
    {
      name: 'Teacher & Staff',
      url: '/admin/teachers-staff',
      icon: Users,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                {/* <activeTeam.logo className="size-4" /> */}
                <Pen className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">NgabsenYuk</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
        <SidebarSeparator className="hidden group-data-[collapsible=icon]:flex" />
        <NavProjects projects={data.students} label="Students" />
        <SidebarSeparator className="hidden group-data-[collapsible=icon]:flex" />
        <NavProjects projects={data.admin} label="Admin" />
      </SidebarContent>
      <SidebarFooter>{/* <NavUser user={data.user} /> */}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
