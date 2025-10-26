import { usePage } from '@inertiajs/react'
import dayjs from 'dayjs'
import { Clock, LogOut, TrendingUp, User } from 'lucide-react'
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import Action from '../components/action'
import Attendance from '../components/attendance'
import Leave from '../components/leave'

const Dashboard: React.FC = () => {
  const { auth } = usePage().props as any
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* {JSON.stringify(auth.user)} */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="flex flex-row items-center gap-3">
            <User />
            Welcome Back
          </CardTitle>
          <CardDescription>Here's your attendance overview for today</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Current Time</span>
            <span className="font-medium">{dayjs().format('HH:mm')}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Status</span>
            <span className="font-medium">Student</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Major</span>
            <span className="font-medium">{auth.user.major || '-'}</span>
          </div>
        </CardContent>
      </Card>
      <Attendance />
      <Leave />
      <Action />
    </div>
  )
}

export default Dashboard
