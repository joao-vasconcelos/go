import PageContainer from '../components/PageContainer';
import { useSession } from 'next-auth/react';

export default function Dashboard() {
  //

  const { data: session, status } = useSession();

  return <PageContainer title={[`Olá ${(session && session.user.name) || '-'}`]}></PageContainer>;
}
