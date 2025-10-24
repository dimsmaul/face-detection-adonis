import dayjs from 'dayjs'
import React from 'react'
import { List } from '~/components/list'
import Preview from '~/components/preview'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent } from '~/components/ui/card'
import MonthPicker from '../components/month'
import { router } from '@inertiajs/react'
import { DateTime } from 'luxon'

const AttendanceList: React.FC<AttendanceResponse> = (props) => {
  const [month, setMonth] = React.useState<number>(dayjs().month() + 1)

  const handleMonthChange = (month: number) => {
    setMonth(month)
    router.get(
      '/attendance',
      {
        month: month,
      },
      {
        preserveState: true,
        replace: true,
      }
    )
  }

  return (
    <div>
      <div className="flex flex-row items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Attendance List</h1>

        <div>
          <MonthPicker
            value={month}
            onChange={(month) => {
              handleMonthChange(month)
            }}
          />
        </div>
      </div>
      {/* {JSON.stringify(props.data)} */}
      <div>
        <List
          data={props.data}
          renderItem={(item) => {
            return (
              <Card>
                <CardContent className="grid grid-cols-6">
                  <div className="">
                    <Preview label={'Date'} children={dayjs(item.date).format('DD MMM YYYY')} />
                  </div>
                  <div className="">
                    <Preview
                      label={'Clock In'}
                      children={
                        item.time
                          ? DateTime.fromISO(`${item.date}T${item.time}`, { zone: 'utc' })
                              .setZone('Asia/Jakarta')
                              .toFormat('HH:mm')
                          : '-'
                      }
                    />
                  </div>
                  <div className="">
                    <Preview
                      label={'Clock Out'}
                      children={
                        item.timeOut
                          ? DateTime.fromISO(`${item.date}T${item.timeOut}`, { zone: 'utc' })
                              .setZone('Asia/Jakarta')
                              .toFormat('HH:mm')
                          : '-'
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <Preview label={'Notes'} children={item.note || '-'} />
                  </div>
                  <div className="">
                    <Preview
                      label={'Status'}
                      children={
                        <Badge
                          variant={
                            ['secondary', 'default', 'default', 'destructive'][item.status] as
                              | 'default'
                              | 'secondary'
                              | 'destructive'
                              | 'outline'
                          }
                        >
                          {['Pending', 'Presence', 'Leave', 'Absent'][item.status]}
                        </Badge>
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            )
          }}
        />
      </div>
    </div>
  )
}

export default AttendanceList
