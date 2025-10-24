import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { vineResolver } from '@hookform/resolvers/vine'
import { Inertia } from '@inertiajs/inertia'
import { Head, Link } from '@inertiajs/react'
import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'
import { useForm } from 'react-hook-form'

export default function SignUp() {
  const form = useForm<Infer<typeof formSchema>>({
    resolver: vineResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  function onSubmit(values: Infer<typeof formSchema>) {
    Inertia.post('/sign-up', { ...values, name: values.name })
  }

  return (
    <div className="flex justify-center items-center h-screen w-screen overflow-hidden">
      <Head title="Sign Up" />

      <img src="/img/auth.jpg" alt="" className="w-1/2 object-cover grayscale h-screen" />
      <div className="w-1/2 p-20">
        <h1 className="text-5xl font-bold mb-8">Sign Up</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Input name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Input email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Input password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Input confirm password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
              <div>
                <span className="text-sm">
                  Already have an account?{' '}
                  <Link href={'/'} className="text-sm hover:underline font-bold">
                    Sign In
                  </Link>
                </span>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

// const SignUpRequest = (body: z.infer<typeof formSchema>) => {
//   const data = unauth.post('/auth/sign-up', body)
//   return data
// }
const formSchema = vine.compile(
  vine.object({
    name: vine.string().minLength(2),
    email: vine.string().email(),
    password: vine.string().minLength(8),
    confirmPassword: vine.string().minLength(8).sameAs('password'),
  })
)

// const formSchema = z
//   .object({
//     name: z.string('Required').min(2, 'Name must be at least 2 characters'),
//     email: z.email('Invalid email address'),
//     password: z.string('Required').min(8, 'Password must be at least 8 characters'),
//     confirmPassword: z.string('Required').min(8, 'Password must be at least 8 characters'),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: 'Passwords do not match',
//   })
