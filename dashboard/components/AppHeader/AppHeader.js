import { useSession } from 'next-auth/react';
import styles from './AppHeader.module.css';
import AppOptions from '../AppOptions/AppOptions';
import { useState } from 'react';

const greetings = ['Olá', 'Hi', 'Hey', 'Oi', 'Hallo', 'Привіт', 'Ciao', 'Hej'];

export default function AppHeader() {
  //
  const { data: session } = useSession();

  const [drawnGreeting] = useState(greetings[(greetings.length * Math.random()) | 0]);

  return (
    <div className={styles.container}>
      <p className={styles.greeting}>{session?.user?.name ? `${drawnGreeting} ${session?.user?.name}` : '• • •'}</p>
      <div className={styles.options}>
        <AppOptions />
      </div>
    </div>
  );
}
