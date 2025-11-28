import { router } from '@inertiajs/react'
import dayjs from 'dayjs'
import { Download, Edit, Eye, Import, Plus, Trash } from 'lucide-react'
import React from 'react'
import { List } from '~/components/list'
import Preview from '~/components/preview'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { ScheduleTypeDatum } from '../types/types'
import ScheduleForm from '../component/form'
import ScheduleUpload from '../component/upload'
import MonthPicker from '~/pages/users/attendance/components/month'
import axios from 'axios'
import { confirmAPIForm } from '~/components/alert'

export interface SchedulePagesProps {
  data: ScheduleTypeDatum[]
}

const SchedulePages: React.FC<SchedulePagesProps> = (props) => {
  const [open, setOpen] = React.useState<{ id?: number; open: boolean }>({
    id: undefined,
    open: false,
  })
  const [uploadOpen, setUploadOpen] = React.useState<boolean>(false)
  const [month, setMonth] = React.useState<number>(dayjs().month() + 1)

  const handleDownloadTemplate = () => {
    // download at a /public/template/template.xlsx file
    const link = document.createElement('a')
    link.href = '/template/template.xlsx'
    link.download = 'schedule_template.xlsx'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleMonthChange = (month: number) => {
    setMonth(month)
    router.get(
      '/admin/schedule',
      {
        month: month,
      },
      {
        preserveState: true,
        replace: true,
      }
    )
  }

  const handleDelete = (id: number) => {
    confirmAPIForm({
      callAPI: async () => await axios.delete(`/api/schedules/${id}`),
      onAlertSuccess: () => {
        router.reload({ only: ['data'] })
      },
    })
  }
  

  // const meta = props.data?.meta
  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Schedule</h1>
          <div className="flex flex-row gap-2">
            <MonthPicker
              value={month}
              onChange={(month) => {
                handleMonthChange(month)
              }}
            />
            <Button variant={'outline'} onClick={handleDownloadTemplate}>
              <Download />
              Download Template
            </Button>
            <Button variant={'outline'} onClick={() => setUploadOpen(true)}>
              <Import />
              Import
            </Button>
            <Button
              size={'icon'}
              onClick={() =>
                setOpen({
                  open: true,
                  id: undefined,
                })
              }
            >
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
                          <Button
                            variant={'outline'}
                            size={'icon'}
                            onClick={() => {
                              setOpen({
                                id: item.id,
                                open: true,
                              })
                            }}
                          >
                            <Edit />
                          </Button>
                          <Button
                            variant={'destructive'}
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
          // pagination={{
          //   type: 'button-handle',
          //   limit: meta.perPage,
          //   page: meta.currentPage,
          //   totalRecord: meta.total,
          //   totalPages: meta.lastPage,
          // }}
        />
      </div>
      <ScheduleForm
        id={open.id}
        open={open.open}
        onClose={() => setOpen({ open: false })}
        onSuccess={() => {
          router.reload({ only: ['data'] })
          setOpen({ open: false, id: undefined })
        }}
      />
      <ScheduleUpload
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSuccess={() => {
          setUploadOpen(false)
          router.reload({ only: ['data'] })
        }}
      />
    </>
  )
}

export default SchedulePages
