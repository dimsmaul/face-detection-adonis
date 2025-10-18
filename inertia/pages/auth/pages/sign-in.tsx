import { Button } from '@/components/ui/button'
import vine from '@vinejs/vine'
import { useForm } from 'react-hook-form'
import { vineResolver } from '@hookform/resolvers/vine'
import { Infer } from '@vinejs/vine/types'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Head, Link } from '@inertiajs/react'
import { Input } from '~/components/ui/input'
import { Inertia } from '@inertiajs/inertia'

export default function SignIn() {
  //   const { setUsers } = useAuthStore();
  const form = useForm<Infer<typeof formSchema>>({
    resolver: vineResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  //   const mutation = useMutation({
  //     mutationFn: (data: z.infer<typeof formSchema>) => SignInRequest(data),
  //     onSuccess: (data) => {
  //       setUsers(data.data.data)
  //     },
  //   })

  function onSubmit(values: Infer<typeof formSchema>) {
    Inertia.post('/', { ...values })
    // mutation.mutate(values)
  }

  return (
    <div className="flex justify-center items-center h-screen w-screen overflow-hidden">
      <Head title='Sign In' />
      <img src="/img/auth.jpg" alt="" className="w-1/2 object-cover grayscale h-screen" />
      <div className="w-1/2 p-20">
        <h1 className="text-5xl font-bold mb-8">Sign In</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5">
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
                    <FormDescription>
                      <div className="flex justify-between">
                        <div>
                          <FormMessage />
                        </div>
                        <Link
                          href={'/forgot-password'}
                          className="text-sm hover:underline text-blue-500 dark:text-muted-foreground"
                        >
                          Forgot Password ?
                        </Link>
                      </div>
                    </FormDescription>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Sign In
              </Button>
              <div>
                <span className="text-sm">
                  Don&apos;t have an account?{' '}
                  <Link href={'/sign-up'} className="text-sm hover:underline font-bold">
                    Sign Up
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

// const SignInRequest = (body: z.infer<typeof formSchema>) => {
//   const data = unauth.post('/auth/sign-in', body)
//   return data
// }

const formSchema = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(8),
  })
)

// const formSchema = z.object({
//   email: z.email("Invalid email address"),
//   password: z.string().min(8, "Password must be at least 8 characters"),
// });
