'use client';

import styles from './layout.module.css';
import Image from 'next/image';
import appBackground from '../../public/background.jpg';
import carrisMetropolitanaLogo from '../../public/carris-metropolitana.svg';
import { SessionProvider } from 'next-auth/react';

// {children} will be a page or nested layout
export default function DashboardLayout({ children, session }) {
  //

  return (
    <SessionProvider session={session}>
      <div className={styles.container} style={{ backgroundImage: `url(${appBackground.src})` }}>
        <div className={styles.loginForm}>
          <div className={styles.logoWrapper}>
            <Image className={styles.logoImg} priority src={carrisMetropolitanaLogo} alt={'Carris Metropolitana'} />
          </div>
          <div className={styles.formWrapper}>{children}</div>
        </div>
      </div>
    </SessionProvider>
  );
}
