'use client';

import styles from './layout.module.css';
import { MantineProvider } from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import appBackground from '../../../public/background.jpg';
import { SessionProvider } from 'next-auth/react';
import { CMLogo } from '../../../components/AppLogos/AppLogos';

// {children} will be a page or nested layout
export default function AuthLayout({ children, session }) {
  //

  const preferredColorScheme = useColorScheme();

  return (
    <SessionProvider session={session}>
      <MantineProvider theme={{ colorScheme: preferredColorScheme }} withGlobalStyles withNormalizeCSS>
        <div className={styles.container} style={{ backgroundImage: `url(${appBackground.src})` }}>
          <div className={styles.loginForm}>
            <div className={styles.logoWrapper}>
              <CMLogo />
            </div>
            <div className={styles.formWrapper}>{children}</div>
          </div>
        </div>
      </MantineProvider>
    </SessionProvider>
  );
}
