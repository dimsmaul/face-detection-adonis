import { router } from '@inertiajs/react'
import { Calendar, Database, LogOut, TrendingUp } from 'lucide-react'
import React from 'react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'

const Action: React.FC = () => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex flex-row items-center gap-3">
          <TrendingUp />
          Quick Action
        </CardTitle>
        <CardDescription>Quick access to common tasks</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-4">
        <Button
          variant={'outline'}
          className="flex flex-col h-fit py-5 "
          onClick={() => {
            router.visit('/attendance')
          }}
        >
          <Calendar className="size-8" />
          <div className="">Attendance Record</div>
        </Button>
        <Button
          variant={'outline'}
          className="flex flex-col h-fit py-5 "
          onClick={() => router.visit('/leave')}
        >
          <LogOut className="size-8" />
          <div className="">Request Leave</div>
        </Button>
        <Button
          variant={'outline'}
          className="flex flex-col h-fit py-5 "
          onClick={() => router.visit('/logs')}
        >
          <Database className="size-8" />
          <div className="btn">Log</div>
        </Button>
      </CardContent>
    </Card>
  )
}

export default Action
