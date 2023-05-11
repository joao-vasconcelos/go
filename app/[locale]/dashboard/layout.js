'use client';

import 'dayjs/locale/pt';
import { SWRConfig } from 'swr';
import { SessionProvider } from 'next-auth/react';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { DatesProvider } from '@mantine/dates';
import styles from './layout.module.css';
import Image from 'next/image';
import carrisMetropolitanaIcon from '../../../public/appicon.svg';
import AppHeader from '../../../components/AppHeader/AppHeader';
import AppSidebar from '../../../components/AppSidebar/AppSidebar';

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

  return (
    <SessionProvider session={session}>
      <SWRConfig value={swrOptions}>
        <DatesProvider settings={{ locale: 'pt' }}>
          <Notifications />
          <ModalsProvider>
            <div className={styles.pageWrapper}>
              <Image priority className={styles.appIcon} src={carrisMetropolitanaIcon} alt={'Carris Metropolitana'} />
              <AppHeader />
              <AppSidebar />
              <div className={styles.content}>{children}</div>
            </div>
          </ModalsProvider>
        </DatesProvider>
      </SWRConfig>
    </SessionProvider>
  );
}
