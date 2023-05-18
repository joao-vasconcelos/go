'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AuthGate({ permission = '', scope, redirect = false, children }) {
  //

  const router = useRouter();
  const { data: session } = useSession();

  //   return children;
  if (session?.user?.permissions[permission] === true) {
    return children;
  } else {
    if (redirect) router.push('/dashboard');
    return <></>;
  }

  //
}

export function isAllowed(session, permission, scope) {
  if (session?.user?.permissions[permission] === true) return true;
  else return false;
}
