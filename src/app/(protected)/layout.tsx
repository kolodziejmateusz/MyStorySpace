'use client';
import { useAuth } from '@/contexts/AuthProvider';
import { useLayoutEffect } from 'react';
import { redirect } from 'next/navigation';
import { usePathname } from 'next/navigation';

function Protected({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { currentUser } = useAuth();
  const returnUrl = usePathname();

  useLayoutEffect(() => {
    if (!currentUser) {
      redirect(`/login?returnUrl=${returnUrl}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <>{children}</>;
}

export default Protected;
