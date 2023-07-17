import { useSession } from 'next-auth/react';
import styles from './AppHeader.module.css';
import AppOptions from '../AppOptions/AppOptions';

export default function AppHeader() {
  //
  const { data: session, status } = useSession();

  const greetings = ['Olá', 'Hi', 'Hey', 'Oi', 'Hallo', 'Привіт', 'Ciao', 'Hej'];

  return (
    <div className={styles.container}>
      <p className={styles.greeting}>{session ? `${greetings[(greetings.length * Math.random()) | 0]} ${session.user?.name}` : '• • •'}</p>
      <div className={styles.options}>
        <AppOptions />
      </div>
    </div>
  );
}
