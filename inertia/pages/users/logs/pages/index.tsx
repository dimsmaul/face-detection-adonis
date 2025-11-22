import dayjs from 'dayjs'
import React from 'react'
import { List } from '~/components/list'
import Preview from '~/components/preview'
import { Card, CardContent } from '~/components/ui/card'

export interface LogListProps {
  log: any[]
}

const LogList: React.FC<LogListProps> = (props) => {
  return (
    <div>
      <div className="flex flex-row items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Log List</h1>
      </div>
      <div>
        <List
          data={props.log || []}
          renderItem={(item) => {
            return (
              <Card>
                <CardContent className="grid grid-cols-5">
                  <div className="">
                    <Preview label={'Date'} children={dayjs(item.date).format('DD MMM YYYY')} />
                  </div>
                  <div className="">
                    <Preview label={'Time'} children={item.time} />
                  </div>

                  <div className="col-span-3">
                    <Preview label={'Notes'} children={item.note || '-'} />
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

export default LogList
