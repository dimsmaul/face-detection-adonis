import { Edit, Plus, Trash } from 'lucide-react'
import React from 'react'
import { List } from '~/components/list'
import { Button } from '~/components/ui/button'
import LeaveAction from './action'
import { Card, CardContent } from '~/components/ui/card'
import Preview from '~/components/preview'
import dayjs from 'dayjs'
import { useLeave } from '../hooks/useLeave'

export interface LeaveListProps {
  leave: any[]
}

const LeaveList: React.FC<LeaveListProps> = (props) => {
  const [open, setOpen] = React.useState(false)
  const { handleDelete } = useLeave()
  return (
    <div>
      <div className="flex flex-row items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Permit List</h1>
        <Button onClick={() => setOpen(true)}>
          <Plus /> Add Permit
        </Button>
      </div>
      <div>
        <List
          data={props.leave || []}
          renderItem={(item) => {
            return (
              <Card>
                <CardContent className="grid grid-cols-6">
                  <div className="">
                    <Preview label={'Date'} children={dayjs(item.date).format('DD MMM YYYY')} />
                  </div>
                  {/*<div className="">
                    <Preview
                      label={'Time'}
                      children={
                        item.time
                          ? DateTime.fromISO(`${item.date}T${item.time}`, { zone: 'utc' })
                              .setZone('Asia/Jakarta')
                              .toFormat('HH:mm')
                          : '-'
                      }
                    />
                  </div>*/}

                  <div className="col-span-3">
                    <Preview label={'Notes'} children={item.note || '-'} />
                  </div>
                  <div className="">
                    <Preview
                      label={'Attachment'}
                      children={
                        <Button
                          variant={'outline'}
                          onClick={() => window.open(item.attachment, '_blank')}
                        >
                          {'Attachment'}
                        </Button>
                      }
                    />
                  </div>
                  <div className="">
                    <Preview
                      label={'Action'}
                      children={
                        <div className="flex flex-row gap-2 ">
                          <Button variant={'outline'} size={'icon'}>
                            <Edit />
                          </Button>
                          <Button
                            variant={'outline'}
                            size={'icon'}
                            onClick={() => handleDelete(item.id)}
                          >
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
        />
      </div>
      <LeaveAction open={open} onOpenChange={() => setOpen(false)} />
    </div>
  )
}

export default LeaveList
