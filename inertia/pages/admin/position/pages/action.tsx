import { vineResolver } from '@hookform/resolvers/vine'
import { router } from '@inertiajs/react'
import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'
import React from 'react'
import { useForm } from 'react-hook-form'
import { confirmAPIForm } from '~/components/alert'
import { Button } from '~/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import axios from 'axios'

interface PositionActionProps {
  position?: {
    id: string
    name: string
  }
}

const PositionAction: React.FC<PositionActionProps> = (props) => {
  const form = useForm<Infer<typeof formSchema>>({
    resolver: vineResolver(formSchema),
    defaultValues: {
      name: props.position?.name || '',
    },
  })

  const handleSubmit = (data: Infer<typeof formSchema>) => {
    confirmAPIForm({
      callAPI: () =>
        props.position?.id
          ? axios.put(`/api/positions/${props.position?.id}`, data)
          : axios.post('/api/positions', data),
      onAlertSuccess: () => {
        router.visit('/admin/positions')
      },
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Position</h1>
      </div>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="col-span-2 flex justify-end gap-3">
                <Button
                  variant={'outline'}
                  type="button"
                  onClick={() => router.visit('/admin/positions')}
                >
                  Cancel
                </Button>
                <Button type="submit">Submit</Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default PositionAction

const formSchema = vine.compile(
  vine.object({
    name: vine.string(),
  })
)
