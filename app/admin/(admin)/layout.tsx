import { AdminHeader } from '@/components/layout/admin/admin-header';
import { AdminFooter } from '@/components/layout/admin/admin-footer';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <AdminHeader />
      {children}
      <AdminFooter />
    </section>
  );
}
