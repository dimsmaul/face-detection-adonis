import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { AdminDashboardProps } from '../types/type'
import { List } from '~/components/list'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { ChartPieDonutActive } from '../components/pie-chart'
import { ChartBarDefault } from '../components/bar-chart'

const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        {/* <h1 className="text-xl font-semibold">Dashboard</h1> */}
      </div>

      <div>
        <div className="grid grid-cols-2 gap-4">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Attendance Comparison Today</CardTitle>
              <CardDescription>Here's your attendance overview for today</CardDescription>
            </CardHeader>

            <CardContent>
              <ChartPieDonutActive
                absent={props.compare.absent}
                permit={props.compare.leave}
                present={props.compare.present}
              />
            </CardContent>
          </Card>
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Who's Leave Today</CardTitle>
              <CardDescription>Here's your attendance overview for today</CardDescription>
            </CardHeader>
            <CardContent className="overflow-y-auto h-full">
              <List
                data={props.permit || []}
                className="gap-1"
                renderItem={(item: LeaveData) => (
                  <div className="flex flex-row items-center gap-2 pb-1">
                    <Avatar>
                      <AvatarImage src={item.user.profile} className="object-cover" />
                      <AvatarFallback className="capitalize">{item.user.name}</AvatarFallback>
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
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Attendance Overview This Year</CardTitle>
              <CardDescription>Here's your attendance overview for this year</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartBarDefault data={props.monthlyData} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
