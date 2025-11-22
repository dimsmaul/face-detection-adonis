import React from 'react'
import { ScheduleDetailType } from '../types/types'
import { List } from '~/components/list'
import { Card, CardContent } from '~/components/ui/card'
import Preview from '~/components/preview'
import { Badge } from '~/components/ui/badge'
import { DateTime } from 'luxon'

export interface ScheduleDetailProps {
  data: ScheduleDetailType[]
}

const ScheduleDetail: React.FC<ScheduleDetailProps> = ({ data }) => {
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
          <div className="flex flex-row gap-2"></div>
        </div>
        <List
          data={data}
          renderItem={(item) => {
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
                      children={localized(item.attendances?.[0]?.time) || '-'}
                    />
                  </div>
                  <div className="">
                    <Preview
                      label={'Status'}
                      children={
                        <Badge
                          variant={
                            ['secondary', 'default', 'outline', 'destructive'][
                              item.attendances?.[0]?.status || 3
                            ] as 'default' | 'secondary' | 'destructive' | 'outline'
                          }
                          className="capitalize"
                        >
                          {
                            ['Pending', 'Presence', 'Permit', 'Absent'][
                              item.attendances?.[0]?.status || 3
                            ]
                          }
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
    </>
  )
}

export default ScheduleDetail
