import React from 'react'
import vine from '@vinejs/vine'
import { useForm } from 'react-hook-form'
import { Infer } from '@vinejs/vine/types'
import { vineResolver } from '@hookform/resolvers/vine'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { DatePicker } from '~/components/date-picker'
import dayjs from 'dayjs'
import FileInput from '~/components/file-input'
import { confirmAPIForm } from '~/components/alert'
import axios from 'axios'
import { Button } from '~/components/ui/button'
import { router } from '@inertiajs/react'

export interface LeaveForm {
  open: boolean
  onOpenChange: () => void
}

const LeaveAction: React.FC<LeaveForm> = ({ open, onOpenChange }) => {
  const form = useForm<Infer<typeof formSchema>>({
    resolver: vineResolver(formSchema),
    defaultValues: {
      date: undefined,
      time: dayjs().format('HH:mm:ss'),
      note: '',
      attachment: null,
    },
  })

  const onSubmit = (data: Infer<typeof formSchema>) => {
    const formData = new FormData()
    formData.append('date', dayjs(data.date).format('YYYY-MM-DD'))
    formData.append('time', data.time)
    formData.append('note', data.note)
    if (data.attachment) {
      formData.append('attachment', data.attachment)
    }

    onOpenChange()

    confirmAPIForm({
      callAPI: async () => await sendLeaveRequest(formData),
      onAlertSuccess: () => {
        form.reset()
        router.reload()
      },
    })
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Leave</DialogTitle>
          </DialogHeader>
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <DatePicker
                            placeholder="Input date"
                            date={field.value ? dayjs(field.value).toDate() : undefined}
                            onChange={(val) => {
                              field.onChange(dayjs(val).toString())
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="note"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Note</FormLabel>
                        <FormControl>
                          <Input placeholder="Input note" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="attachment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Attachment</FormLabel>
                        <FormControl>
                          <FileInput
                            placeholder="Attachment"
                            file={field.value}
                            onChange={(e) => {
                              field.onChange(e.target.files?.[0])
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end">
                    <Button>Submit</Button>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default LeaveAction

const formSchema = vine.compile(
  vine.object({
    date: vine.string(),
    time: vine.string(),
    note: vine.string(),
    attachment: vine.any().optional(),
  })
)

const sendLeaveRequest = async (data: FormData) => {
  const response = await axios.post('/api/permits', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}
