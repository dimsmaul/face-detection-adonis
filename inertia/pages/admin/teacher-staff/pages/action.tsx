import { vineResolver } from '@hookform/resolvers/vine'
import { router } from '@inertiajs/react'
import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'
import axios from 'axios'
import dayjs from 'dayjs'
import { DateTime } from 'luxon'
import React, { useEffect, useMemo } from 'react'
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

interface AdminActionPagesProps {
  position: { id: string; name: string }[]
  admin: AdminActionPagesDataAdmin | null
}

export interface AdminActionPagesDataAdmin {
  id: string
  nip: string
  name: string
  email: string
  subject: string
  status: number
  profile: null
  positionId: string
  userDataId: string
  createdAt: Date
  updatedAt: Date
  userData: AdminActionPagesDataAdminUserData
}

export interface AdminActionPagesDataAdminUserData {
  id: string
  dob: Date
  address: string
  phone: string
  subDistrict: string
  city: string
  province: string
  postalCode: string
  createdAt: Date
  updatedAt: Date
}

const AdminActionPages: React.FC<AdminActionPagesProps> = (props) => {
  const isEditMode = props?.admin?.id ? true : false
  const formValidation = useMemo(() => createFormValidation(isEditMode), [isEditMode])

  const form = useForm<Infer<typeof formValidation>>({
    resolver: vineResolver(formValidation),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      subject: '',
      status: '1',
      profile: undefined,

      positionId: '',

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
    const formData = new FormData()
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'dob' && value) {
          // Convert to ISO datetime string for backend validation
          formData.append(key, DateTime.fromJSDate(value).toISODate()!)
        } else {
          formData.append(key, value as string | Blob)
        }
      }
    })
    confirmAPIForm({
      callAPI: () =>
        isEditMode
          ? axios.put('/api/admin/' + props.admin?.id, formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
            })
          : axios.post('/api/admin', formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
            }),
      onAlertSuccess: () => {
        router.visit('/admin/teachers-staff')
      },
    })
  }

  useEffect(() => {
    if (props.admin) {
      form.reset({
        name: props.admin.name,
        email: props.admin.email,
        password: '',
        subject: props.admin.subject,
        status: props.admin.status.toString(),
        profile: props.admin?.profile ?? '',

        positionId: props.admin.positionId,

        // DATA
        dob: props.admin.userData.dob ? new Date(props.admin.userData.dob) : undefined,
        address: props.admin.userData.address,
        phone: props.admin.userData.phone,
        subDistrict: props.admin.userData.subDistrict,
        city: props.admin.userData.city,
        province: props.admin.userData.province,
        postalCode: props.admin.userData.postalCode,
      })
    }
  }, [props.admin?.id])

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Teacher Staff</h1>
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
              {/* TODO: Position ID read null when submit */}
              <FormField
                name="positionId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select position" className="w-full" />
                        </SelectTrigger>
                        <SelectContent>
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
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-full">
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
                <Button type="submit">Submit</Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default AdminActionPages

const createFormValidation = (isEdit: boolean) => {
  return vine.compile(
    vine.object({
      name: vine.string(),
      email: vine.string().email(),
      password: isEdit ? vine.string().optional() : vine.string().minLength(6),
      subject: vine.string().optional(),
      status: vine.string().minLength(1).maxLength(1),
      profile: vine.any().optional(),
      positionId: vine.string(),

      // DATA
      dob: vine.any().optional(),
      address: vine.string().optional(),
      phone: vine.string().optional(),
      subDistrict: vine.string().optional(),
      city: vine.string().optional(),
      province: vine.string().optional(),
      postalCode: vine.string().optional(),
    })
  )
}
// const formValidation = vine.compile(
//   vine.object({
//     name: vine.string(),
//     email: vine.string().email(),
//     password: vine.string().minLength(6),
//     subject: vine.string().optional(),
//     status: vine.string().minLength(1).maxLength(1),
//     profile: vine.any().optional(),
//     positionId: vine.string(),

//     // DATA
//     dob: vine.any().optional(),
//     address: vine.string().optional(),
//     phone: vine.string().optional(),
//     subDistrict: vine.string().optional(),
//     city: vine.string().optional(),
//     province: vine.string().optional(),
//     postalCode: vine.string().optional(),
//   })
// )
