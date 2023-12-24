import { SignIn } from '@/components/sign-in';

export default function Auth() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-between p-24'>
      <SignIn />
    </div>
  );
}
