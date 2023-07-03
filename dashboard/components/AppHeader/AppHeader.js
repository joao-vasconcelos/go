import { useSession } from 'next-auth/react';
import styles from './AppHeader.module.css';
import AppOptions from '../AppOptions/AppOptions';

export default function AppHeader() {
  //
  const { data: session, status } = useSession();

  return (
    <div className={styles.container}>
      <p className={styles.greeting}>{`Olá ${(session && session.user.name) || '-'}!`}</p>
      <div className={styles.options}>
        <AppOptions />
      </div>
    </div>
  );
}
