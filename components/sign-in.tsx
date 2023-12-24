'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { useApiQuery } from '@/lib/use-api-query';
import { JwtTokensResponse, useJwt } from '@/lib/jwt';
import { SignInSchema } from '@/validation/sign-in-validation';
import { redirect, useRouter } from 'next/navigation';

export function SignIn() {
  const { setTokens, decodeJWT } = useJwt();
  const router = useRouter();

  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      password: '',
      email: '',
    },
  });

  const { sendRequest } = useApiQuery<JwtTokensResponse>({
    url: `auth/authenticate`,
    disableOnMount: true,
    method: 'POST',
    onSuccess: (response) => {
      setTokens(response.accessToken, response.refreshToken);
      const decodedToken = decodeJWT(response.accessToken);
      router.push(decodedToken?.role === 'ADMIN' ? '/admin' : '/');
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: 'Something went wrong!',
      });
    },
  });

  function onSubmit(data: z.infer<typeof SignInSchema>) {
    sendRequest({ ...data, role: 'USER' });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-2/3 space-y-6'>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type='password' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Submit</Button>
      </form>
    </Form>
  );
}
