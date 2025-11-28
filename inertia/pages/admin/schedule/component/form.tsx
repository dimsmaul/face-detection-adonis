import { vineResolver } from '@hookform/resolvers/vine'
import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'
import axios from 'axios'
import dayjs from 'dayjs'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { confirmAPIForm } from '~/components/alert'
import { DatePicker } from '~/components/date-picker'
import { Button } from '~/components/ui/button'
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
import { Label } from '~/components/ui/label'
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'

export interface ScheduleFormProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  id?: number
}

const ScheduleForm: React.FC<ScheduleFormProps> = (props) => {
  const form = useForm<Infer<typeof validation>>({
    resolver: vineResolver(validation),
    defaultValues: {
      date: '',
      time: '',
      type: 'on',
    },
  })

  const onSubmit = async (data: Infer<typeof validation>) => {
    if (props.id) {
      confirmAPIForm({
        callAPI: async () => await axios.put(`/api/schedules/${props.id}`, data),
        onAlertSuccess: () => {
          props.onSuccess()
        },
      })
      return
    }
    confirmAPIForm({
      callAPI: async () => await axios.post('/api/schedules', data),
      onAlertSuccess: () => {
        props.onSuccess()
      },
    })
  }

  const getDetailWhenEdit = async (id: number) => {
    const response = await axios.get(`/api/schedules/show/${id}`)
    const schedule = response.data.data
    console.log('schedule', response)
    form.reset({
      date: dayjs(schedule.date).format('YYYY-MM-DD'),
      time: schedule.time,
      type: schedule.type,
    })
  }

  useEffect(() => {
    if (props.id) {
      getDetailWhenEdit(props.id)
    }
  }, [props.id])

  return (
    <Dialog open={props.open} onOpenChange={props.onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Form</DialogTitle>
        </DialogHeader>

        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-5">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <DatePicker
                          placeholder="Input date"
                          date={new Date(field.value)}
                          onChange={(date) => field.onChange(dayjs(date).format('YYYY-MM-DD'))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <FormControl>
                        <Input type="time" placeholder="Input time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="on" id="option-on" />
                            <Label htmlFor="option-on">On</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="off" id="option-off" />
                            <Label htmlFor="option-off">Off</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-row justify-end items-end">
                  <Button
                    type="button"
                    variant={'outline'}
                    className="mr-2"
                    onClick={props.onClose}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save</Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ScheduleForm

const validation = vine.compile(
  vine.object({
    date: vine.string(),
    time: vine.string(),
    type: vine.enum(['on', 'off']),
  })
)
