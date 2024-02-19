'use client';

/* * */

import { useSession } from 'next-auth/react';
import { useRouter } from '@/translations/navigation';
import { useEffect, useMemo } from 'react';
import isAllowed from '@/authentication/isAllowed';

/* * */

export default function AppAuthenticationCheck({ permissions = [], redirect = false, children }) {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const { data: session, status } = useSession();

  //
  // B. Transform data

  const hasPermission = useMemo(() => {
    try {
      return isAllowed(session, permissions);
    } catch (error) {
      return false;
    }
  }, [permissions, session]);

  //
  // C. Handle actions

  useEffect(() => {
    if (status === 'authenticated') {
      if (!hasPermission && redirect) router.push('/dashboard');
    }
  }, [hasPermission, redirect, router, status]);

  //
  // D. Render components

  if (hasPermission) return children;
  else return <></>;

  //
}
