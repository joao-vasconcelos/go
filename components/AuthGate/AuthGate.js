'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

export default function AuthGate({ permission = '', scope, redirect = false, children }) {
  //

  const router = useRouter();
  const { data: session } = useSession();

  const hasPermission = useMemo(() => {
    return session?.user?.permissions[permission] === true;
  }, [permission, session?.user?.permissions]);

  useEffect(() => {
    if (!hasPermission && redirect) router.push('/dashboard');
  }, [hasPermission, redirect, router]);

  //   return children;
  if (hasPermission) return children;
  else return <></>;

  //
}

export function isAllowed(session, permission, scope) {
  if (session?.user?.permissions[permission] === true) return true;
  else return false;
}
