'use client';

import 'dayjs/locale/pt';
import { SWRConfig } from 'swr';
import { SessionProvider } from 'next-auth/react';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { DatesProvider } from '@mantine/dates';
import { useColorScheme } from '@mantine/hooks';
import { MapProvider } from 'react-map-gl';
import styles from './layout.module.css';
import Link from 'next/link';
import AppHeader from '../../../components/AppHeader/AppHeader';
import AppSidebar from '../../../components/AppSidebar/AppSidebar';
import AppLogo from '../../../components/AppLogo/AppLogo';

export default function Layout({ children, session }) {
  //

  // SWR CONFIGURATION
  const swrOptions = {
    refreshInterval: 1000,
    fetcher: async (...args) => {
      const res = await fetch(...args);
      if (!res.ok) {
        const errorDetails = await res.json();
        const error = new Error(errorDetails.message || 'An error occurred while fetching data.');
        error.description = errorDetails.description || 'No additional information was provided by the API.';
        error.status = res.status;
        throw error;
      }
      return res.json();
    },
  };

  // hook will return either 'dark' or 'light' on client
  // and always 'light' during ssr as window.matchMedia is not available
  const preferredColorScheme = useColorScheme();

  return (
    <SessionProvider session={session}>
      <SWRConfig value={swrOptions}>
        <MantineProvider theme={{ colorScheme: preferredColorScheme }} withGlobalStyles withNormalizeCSS>
          <DatesProvider settings={{ locale: 'pt' }}>
            <Notifications />
            <ModalsProvider>
              <MapProvider>
                <div className={styles.pageWrapper}>
                  <Link href={'/'} className={styles.appIcon}>
                    <AppLogo />
                  </Link>
                  <AppHeader />
                  <AppSidebar />
                  <div className={styles.content}>{children}</div>
                </div>
              </MapProvider>
            </ModalsProvider>
          </DatesProvider>
        </MantineProvider>
      </SWRConfig>
    </SessionProvider>
  );
}
