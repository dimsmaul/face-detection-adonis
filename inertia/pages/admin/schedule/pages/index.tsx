import { router } from '@inertiajs/react'
import dayjs from 'dayjs'
import { Download, Edit, Eye, Import, Plus, Trash } from 'lucide-react'
import React from 'react'
import { List } from '~/components/list'
import Preview from '~/components/preview'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { ScheduleType, ScheduleTypeDatum } from '../types/types'
import ScheduleForm from '../component/form'

export interface SchedulePagesProps {
  data: ScheduleTypeDatum[]
}

const SchedulePages: React.FC<SchedulePagesProps> = (props) => {
  const [open, setOpen] = React.useState<boolean>(false)
  // const meta = props.data?.meta
  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Schedule</h1>
          <div className="flex flex-row gap-2">
            <Button variant={'outline'} onClick={() => {}}>
              <Download />
              Download Template
            </Button>
            <Button variant={'outline'} onClick={() => {}}>
              <Import />
              Import
            </Button>
            <Button size={'icon'} onClick={() => setOpen(true)}>
              <Plus />
            </Button>
          </div>
        </div>
        <List
          data={props.data}
          renderItem={(item) => {
            return (
              <Card>
                <CardContent className="grid grid-cols-4">
                  <div className="">
                    <Preview label={'Date'} children={dayjs(item.date).format('DD MMM YYYY')} />
                  </div>
                  <div className="">
                    <Preview label={'Time'} children={item.time} />
                  </div>
                  <div className="">
                    <Preview
                      label={'Schedule Type'}
                      children={
                        <Badge
                          variant={
                            ['default', 'destructive'][item.type == 'on' ? 0 : 1] as
                              | 'default'
                              | 'secondary'
                              | 'destructive'
                              | 'outline'
                          }
                          className="capitalize"
                        >
                          {item.type}
                        </Badge>
                      }
                    />
                  </div>
                  <div className="">
                    <Preview
                      label={'Action'}
                      children={
                        <div className="flex gap-2">
                          <Button
                            variant={'default'}
                            size={'icon'}
                            onClick={() =>
                              router.visit(
                                '/admin/schedule/' + dayjs(item.date).format('YYYY-MM-DD')
                              )
                            }
                          >
                            <Eye />
                          </Button>
                          <Button variant={'outline'} size={'icon'}>
                            <Edit />
                          </Button>
                          <Button variant={'destructive'} size={'icon'}>
                            <Trash />
                          </Button>
                        </div>
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            )
          }}
          // pagination={{
          //   type: 'button-handle',
          //   limit: meta.perPage,
          //   page: meta.currentPage,
          //   totalRecord: meta.total,
          //   totalPages: meta.lastPage,
          // }}
        />
      </div>
      <ScheduleForm open={open} onClose={() => setOpen(false)} />
    </>
  )
}

export default SchedulePages
