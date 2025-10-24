import React from 'react'
import NoLayouts from './no-layout'
import { router, usePage } from '@inertiajs/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { User, LogOut } from 'lucide-react'

const UserDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { auth } = usePage().props as any

  const handleLogOut = () => {
    router.post('/sign-out')
  }
  return (
    <NoLayouts>
      <div>
        <div className="flex py-4 px-10 border-b justify-between items-center sticky top-0 bg-background">
          <div onClick={() => router.visit('/dashboard')} className="cursor-pointer">
            <h1 className="text-lg font-semibold">NgabsenYuk</h1>
          </div>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="flex flex-row items-center gap-2">
                  <Avatar>
                    <AvatarImage
                      src={auth.user.profile}
                      alt={auth.user.name}
                      className="object-cover"
                    />
                    <AvatarFallback>{auth.user.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="">Hello, {auth.user.name}</span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <User />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogOut}>
                  <LogOut />
                  LogOut
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="px-10 py-5">{children}</div>
      </div>
    </NoLayouts>
  )
}

export default UserDashboardLayout
