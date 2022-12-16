import { useSession } from 'next-auth/react';

export default function AuthChecker({ authenticated, loading, unauthenticated }) {
  const { status } = useSession();
  switch (status) {
    case 'authenticated':
      return authenticated;
    case 'loading':
      return loading;
    default:
      return unauthenticated;
  }
}
