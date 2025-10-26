import { usePage } from '@inertiajs/react'
import { LogOut } from 'lucide-react'
import React from 'react'
import { List } from '~/components/list'
import { Avatar, AvatarImage, AvatarFallback } from '~/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'

const Leave: React.FC = () => {
  const props = usePage().props as any
  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="flex flex-row items-center gap-3">
          <LogOut />
          Who's Leave Today
        </CardTitle>
        <CardDescription>Here's your attendance overview for today</CardDescription>
      </CardHeader>
      <CardContent className="overflow-y-auto h-40">
        <List
          data={props.permit || []}
          className="gap-1"
          renderItem={(item: LeaveData) => (
            <div className="flex flex-row items-center gap-2 pb-1">
              <Avatar>
                <AvatarImage src={item.user.profile} className="object-cover" />
                <AvatarFallback>{item.user.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <span className="text-base">{item.user.name}</span>
                <p className="text-sm text-muted-foreground">{item.user.email || '-'}</p>
              </div>
            </div>
          )}
        />
      </CardContent>
    </Card>
  )
}

export default Leave
