'use client';

/* * */

import 'dayjs/locale/pt';
import { SWRConfig } from 'swr';
import { SessionProvider } from 'next-auth/react';
import { MantineProvider } from '@mantine/core';
import { MapProvider } from 'react-map-gl/maplibre';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { DatesProvider } from '@mantine/dates';
import { theme } from '@/styles/theme';

/* * */

export default function Providers({ children, session }) {
  //

  //
  // A. Setup SWR

  const swrOptions = {
    refreshInterval: 30000,
    revalidateOnMount: true,
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

  //
  // B. Render components

  return (
    <SessionProvider session={session} refetchInterval={5}>
      <SWRConfig value={swrOptions}>
        <MapProvider>
          <MantineProvider theme={theme} defaultColorScheme="auto">
            <DatesProvider settings={{ locale: 'pt' }}>
              <Notifications />
              <ModalsProvider>{children}</ModalsProvider>
            </DatesProvider>
          </MantineProvider>
        </MapProvider>
      </SWRConfig>
    </SessionProvider>
  );

  //
}
