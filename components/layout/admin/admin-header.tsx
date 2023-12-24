import { ModeToggle } from '@/components/mode-toggle';
import { ProfileDropdown } from '@/components/profile-dropdown';

export function AdminHeader() {
  return (
    <header className='flex w-full justify-between border-b-2 px-4 py-2'>
      <div className='text-2xl'>Dashboard</div>
      <div className='flex items-center gap-4'>
        <ProfileDropdown />
        <ModeToggle />
      </div>
    </header>
  );
}
