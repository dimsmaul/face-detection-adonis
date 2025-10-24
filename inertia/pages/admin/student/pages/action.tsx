import { vineResolver } from '@hookform/resolvers/vine'
import { router } from '@inertiajs/react'
import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'
import axios from 'axios'
import dayjs from 'dayjs'
import { Eye } from 'lucide-react'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { confirmAPIForm } from '~/components/alert'
import { DatePicker } from '~/components/date-picker'
import FileInput from '~/components/file-input'
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

interface StudentActionPagesProps {
  user: {
    id: string
    nim: null
    name: string
    email: string
    major: null
    status: null
    dateOfAcceptance: null
    profile: null
    userDataId: null
    createdAt: string
    updatedAt: string
    deletedAt: null
    userData: {
      id: string
      dob: null
      address: null
      phone: null
      subDistrict: null
      city: null
      province: null
      postalCode: null
      createdAt: string
      updatedAt: string
      deletedAt: null
    } | null
  }
}

const StudentActionPages: React.FC<StudentActionPagesProps> = (props) => {
  const form = useForm<Infer<typeof formValidation>>({
    resolver: vineResolver(formValidation),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      major: '',
      status: '1',
      dateOfAcceptance: undefined,
      profile: undefined,

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

  useEffect(() => {
    if (props.user) {
      form.setValue('name', props.user?.name)
      form.setValue('email', props.user?.email)
      form.setValue('major', props.user?.major || '')
      form.setValue('status', (props.user?.status || 1).toString())
      form.setValue('profile', props.user?.profile || '')
      form.setValue('dateOfAcceptance', props.user?.dateOfAcceptance || '')

      if (props.user?.userData) {
        form.setValue('dob', props.user?.userData?.dob || '')
        form.setValue('address', props.user?.userData?.address || '')
        form.setValue('phone', props.user?.userData?.phone || '')
        form.setValue('subDistrict', props.user?.userData?.subDistrict || '')
        form.setValue('city', props.user?.userData?.city || '')
        form.setValue('province', props.user?.userData?.province || '')
        form.setValue('postalCode', props.user?.userData?.postalCode || '')
      }
    }
  }, [props.user?.id, form])

  const onSubmit = (values: Infer<typeof formValidation>) => {
    const formData = new FormData()
    // Object.keys(values).forEach((key) => {
    //   const value = (values as any)[key]
    //   if (value !== undefined && value !== null) {
    //     formData.append(key, value)
    //   }
    // })
    formData.append('name', values.name)
    formData.append('email', values.email)
    formData.append('password', values.password)
    formData.append('major', values.major || '')
    formData.append('status', values.status)
    if (values.profile instanceof File) {
      formData.append('profile', values.profile)
    } else {
      formData.append('profile', '')
    }
    formData.append(
      'dateOfAcceptance',
      values.dateOfAcceptance ? dayjs(values.dateOfAcceptance).format('YYYY-MM-DD') : ''
    )

    // DATA
    formData.append('dob', values.dob ? dayjs(values.dob).format('YYYY-MM-DD') : '')
    formData.append('address', values.address || '')
    formData.append('phone', values.phone || '')
    formData.append('subDistrict', values.subDistrict || '')
    formData.append('city', values.city || '')
    formData.append('province', values.province || '')
    formData.append('postalCode', values.postalCode || '')

    confirmAPIForm({
      callAPI: () =>
        props.user?.id
          ? axios.put(`/api/users/${props.user?.id}`, formData)
          : axios.post('/api/users', formData),
      onAlertSuccess: () => {
        router.visit('/admin/students')
      },
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Student</h1>
        {/* {JSON.stringify(props.user?)} */}
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
                      <Input placeholder="Enter password" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="major"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Major</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter major" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="dateOfAcceptance"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Acceptance</FormLabel>
                    <FormControl>
                      <DatePicker
                        placeholder="Enter date of acceptance"
                        date={dayjs(field.value).toDate()}
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
                name="profile"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile</FormLabel>
                    <FormControl>
                      <FileInput
                        file={field.value}
                        placeholder="Enter profile"
                        onChange={(e) => {
                          // console.log(e.target.files?.[0])
                          field.onChange(e.target.files?.[0])
                        }}
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
                        date={dayjs(field.value).toDate()}
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
                  onClick={() => router.visit('/admin/students')}
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

export default StudentActionPages

const formValidation = vine.compile(
  vine.object({
    name: vine.string(),
    email: vine.string().email(),
    password: vine.string().minLength(6),
    major: vine.string().optional(),
    status: vine.string().minLength(1).maxLength(1),
    dateOfAcceptance: vine.string().optional(),
    profile: vine.any().optional(),

    // DATA
    dob: vine.string().optional(),
    address: vine.string().optional(),
    phone: vine.string().optional(),
    subDistrict: vine.string().optional(),
    city: vine.string().optional(),
    province: vine.string().optional(),
    postalCode: vine.string().optional(),
  })
)
