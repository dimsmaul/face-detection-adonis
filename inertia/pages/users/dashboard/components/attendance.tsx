import { usePage } from '@inertiajs/react'
import dayjs from 'dayjs'
import { Clock, MoveDownRight, MoveUpRight } from 'lucide-react'
import React from 'react'
import { Button } from '~/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '~/components/ui/card'
import Camera from './camera'
import { DateTime } from 'luxon'

const Attendance: React.FC = () => {
  const { auth, attendance } = usePage().props as any
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Card className="">
        <CardHeader>
          <CardTitle className="flex flex-row items-center gap-3">
            <Clock />
            Today's Attendance
          </CardTitle>
          <CardDescription>{dayjs().format('dddd, MMMM DD, YYYY')}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-row items-center gap-2">
            <MoveUpRight className="size-6 border-foreground border-1 rounded-full p-1" />
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Check-in Time</span>
              <span className="font-medium">
                {attendance == null
                  ? '-'
                  : DateTime.fromISO(`${attendance?.date}T${attendance?.time}`, { zone: 'utc' })
                      .setZone('Asia/Jakarta')
                      .toFormat('HH:mm')}
              </span>
            </div>
          </div>
          <div className="flex flex-row items-center gap-2">
            <MoveDownRight className="size-6 border-foreground border-1 rounded-full p-1" />
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Check-out Time</span>
              <span className="font-medium">
                {attendance === null || attendance?.timeOut === null
                  ? '-'
                  : DateTime.fromISO(`${attendance?.date}T${attendance?.timeOut}`, { zone: 'utc' })
                      .setZone('Asia/Jakarta')
                      .toFormat('HH:mm')}
              </span>
            </div>
          </div>
          {(attendance === null || attendance?.timeOut === null) && (
            <Button className="w-full" onClick={() => setOpen(true)}>
              {attendance == null ? 'Clock In' : 'Clock Out'}
            </Button>
          )}
        </CardContent>
      </Card>
      <Camera open={open} onOpenChange={setOpen} image={auth.user?.profile} />
    </>
  )
}

export default Attendance
