import React from 'react'
import { ScheduleDetailType } from '../types/types'
import { List } from '~/components/list'
import { Card, CardContent } from '~/components/ui/card'
import Preview from '~/components/preview'
import { Badge } from '~/components/ui/badge'
import { DateTime } from 'luxon'
import dayjs from 'dayjs'

export interface ScheduleDetailProps {
  data: ScheduleDetailType[]
  schedule: {
    date: string
    time: string
    type: string
  }
}

const ScheduleDetail: React.FC<ScheduleDetailProps> = ({ data, schedule }) => {
  const localized = (time: string | undefined) => {
    if (!time) return '-'
    return DateTime.fromISO(time, { zone: 'utc' })
      .setZone('Asia/Jakarta')
      .toLocaleString(DateTime.TIME_24_WITH_SECONDS)
  }
  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Schedule</h1>
          <div className="flex flex-row gap-2 border rounded-md px-3 py-1 bg-secondary/10">
            {dayjs(schedule.date).format('DD MMM YYYY')} {schedule.time}
          </div>
        </div>
        <List
          data={data}
          renderItem={(item) => {
            const isLate = schedule.time < item.attendances?.[0]?.time
            return (
              <Card>
                <CardContent className="grid grid-cols-4">
                  <div className="">
                    <Preview label={'Name'} children={item.name} />
                  </div>
                  <div className="">
                    <Preview label={'Email'} children={item.email} />
                  </div>
                  <div className="">
                    <Preview
                      label={'Time'}
                      children={
                        localized(item.attendances?.[0]?.time ?? item.permits?.[0]?.time) || '-'
                      }
                    />
                  </div>
                  <div className="">
                    <Preview
                      label={'Status'}
                      children={
                        !item.permits?.[0]?.time ? (
                          <div className="flex flex-row gap-2">
                            <Badge
                              variant={
                                ['secondary', 'default', 'outline', 'destructive'][
                                  item.attendances?.[0]?.status || 3
                                ] as 'default' | 'secondary' | 'destructive' | 'outline'
                              }
                              className="capitalize"
                            >
                              {
                                ['Pending', 'Present', 'Permit', 'Absent'][
                                  item.attendances?.[0]?.status || 3
                                ]
                              }
                            </Badge>
                            {isLate ? (
                              <Badge variant={'destructive'} className="capitalize">
                                Late
                              </Badge>
                            ) : (
                              ''
                            )}
                          </div>
                        ) : (
                          <Badge variant={'secondary'} className="capitalize">
                            Permit
                          </Badge>
                        )
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            )
          }}
        />
      </div>
    </>
  )
}

export default ScheduleDetail
