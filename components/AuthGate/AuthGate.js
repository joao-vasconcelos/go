'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

export default function AuthGate({ scope = '', permission = '', redirect = false, children }) {
  //

  const router = useRouter();
  const { data: session } = useSession();

  const hasPermission = useMemo(() => {
    try {
      return session?.user?.permissions[scope][permission] === true;
    } catch (err) {
      return false;
    }
  }, [permission, scope, session?.user?.permissions]);

  useEffect(() => {
    if (session != undefined) {
      if (!hasPermission && redirect) router.push('/dashboard');
    }
  }, [session, hasPermission, redirect, router]);

  //   return children;
  if (hasPermission) return children;
  else return <></>;

  //
}

export function isAllowed(session, scope, permission) {
  try {
    return session?.user?.permissions[scope][permission] === true;
  } catch (error) {
    return false;
  }
}
