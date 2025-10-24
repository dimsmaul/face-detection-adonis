import { vineResolver } from '@hookform/resolvers/vine'
import { router } from '@inertiajs/react'
import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'
import dayjs from 'dayjs'
import React from 'react'
import { useForm } from 'react-hook-form'
import { DatePicker } from '~/components/date-picker'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Separator } from '~/components/ui/separator'

interface AdminActionPagesProps {
  position: { id: string; name: string }[]
}

const AdminActionPages: React.FC<AdminActionPagesProps> = (props) => {
  const form = useForm<Infer<typeof formValidation>>({
    resolver: vineResolver(formValidation),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      subject: '',
      status: '1',
      profile: undefined,

      position: '',

      // DATA
      dob: undefined,
      address: '',
      phone: '',
      subDistrict: '',
      city: '',
      province: '',
      postalCode: '',
    },
  })

  const onSubmit = (values: Infer<typeof formValidation>) => {
    console.log(values)
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Teacher Staff</h1>
        {/* {JSON.stringify(props.position)} */}
      </div>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
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
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="subject"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter subject" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="position"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Select>
                        <SelectTrigger className="w-full" {...field}>
                          <SelectValue placeholder="Select position" className="w-full" />
                        </SelectTrigger>
                        <SelectContent>
                          {/* <SelectItem value="teacher">Teacher</SelectItem> */}
                          {props.position?.length > 0 ? (
                            props.position?.map((position: { id: string; name: string }) => (
                              <SelectItem key={position.id} value={position.id}>
                                {position.name}
                              </SelectItem>
                            ))
                          ) : (
                            <div className="flex justify-center items-center p-4 text-muted-foreground">
                              No position available
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="profile"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="file"
                        placeholder="Enter profile"
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="status"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select>
                        <SelectTrigger className="w-full" {...field}>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Active</SelectItem>
                          <SelectItem value="0">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="col-span-2">
                <Separator />
              </div>
              <FormField
                name="dob"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <DatePicker
                        placeholder="Enter date of birth"
                        date={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="address"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="phone"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="subDistrict"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sub District</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter sub district" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="city"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter city" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="province"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Province</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter province" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="postalCode"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter postal code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="col-span-2 flex justify-end gap-3">
                <Button
                  type="button"
                  variant={'outline'}
                  onClick={() => router.visit('/admin/teacher-staff')}
                >
                  Cancel
                </Button>
                <Button>Submit</Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default AdminActionPages

const formValidation = vine.compile(
  vine.object({
    name: vine.string(),
    email: vine.string().email(),
    password: vine.string().minLength(6),
    subject: vine.string().optional(),
    status: vine.string().minLength(1).maxLength(1),
    profile: vine.any().optional(),
    position: vine.string(),

    // DATA
    dob: vine.date().optional(),
    address: vine.string().optional(),
    phone: vine.string().optional(),
    subDistrict: vine.string().optional(),
    city: vine.string().optional(),
    province: vine.string().optional(),
    postalCode: vine.string().optional(),
  })
)
