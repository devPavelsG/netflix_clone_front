'use client';

import { useApiQuery } from '@/lib/use-api-query';
import { toast } from '@/components/ui/use-toast';
import { useJwt } from '@/lib/jwt';
import { useRouter } from 'next/navigation';

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  subUsers: SubUser[];
}

export interface SubUser {
  id: string;
  name: string;
}

type UseUserType = {
  user?: User | null;
  logout: Function;
};

export function UseUser(): UseUserType {
  const router = useRouter();
  const { decodedToken, removeTokens } = useJwt();

  const { data: user } = useApiQuery<User>({
    url: 'users/me',
    method: 'GET',
    disableOnMount: !decodedToken,
    onError: (error) => {
      console.error(error);
      toast({
        title: 'Something went wrong!',
      });
    },
  });

  const { sendRequest: logout } = useApiQuery<any>({
    url: 'auth/logout',
    method: 'GET',
    disableOnMount: true,
    onSuccess: () => {
      removeTokens();
      toast({
        title: 'You have been logged out!',
      });
      router.push('/sign-in');
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: 'Something went wrong!',
      });
    },
  });

  return { user, logout };
}
