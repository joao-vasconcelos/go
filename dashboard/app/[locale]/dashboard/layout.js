'use client';

import 'dayjs/locale/pt';
import { SWRConfig } from 'swr';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { DatesProvider } from '@mantine/dates';
import { MapProvider } from 'react-map-gl/maplibre';
import styles from './layout.module.css';
import Link from 'next/link';
import AppHeader from '@/components/AppHeader/AppHeader';
import AppSidebar from '@/components/AppSidebar/AppSidebar';
import { CMIcon } from '@/components/AppLogos/AppLogos';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Layout({ children }) {
  //

  const router = useRouter();

  // SWR CONFIGURATION
  const swrOptions = {
    refreshInterval: 30000,
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

  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push(`/auth/signin?callbackUrl=${window.location.pathname}`);
    },
  });

  return (
    <SWRConfig value={swrOptions}>
      <DatesProvider settings={{ locale: 'pt' }}>
        <Notifications />
        <ModalsProvider>
          <MapProvider>
            <div className={styles.pageWrapper}>
              <Link href={'/'} className={styles.appIcon}>
                <CMIcon />
              </Link>
              <AppHeader />
              <AppSidebar />
              <div className={styles.content}>{children}</div>
            </div>
          </MapProvider>
        </ModalsProvider>
      </DatesProvider>
    </SWRConfig>
  );
}
