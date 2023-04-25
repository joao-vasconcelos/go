'use client';

import { SWRConfig } from 'swr';
import { styled } from '@stitches/react';
import { SessionProvider } from 'next-auth/react';
import Header from './header';
import Sidebar from './sidebar';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';

const PageWrapper = styled('div', {
  position: 'fixed',
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
});

const Body = styled('div', {
  width: '100%',
  height: '100%',
  display: 'grid',
  gridTemplateColumns: '85px 1fr',
});

const Content = styled('div', {
  height: '100%',
  padding: '$md',
  background: '$gray1',
});

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
        <Notifications />
        <ModalsProvider>
          <PageWrapper>
            <Header />
            <Body>
              <Sidebar />
              <Content>{children}</Content>
            </Body>
          </PageWrapper>
        </ModalsProvider>
      </SWRConfig>
    </SessionProvider>
  );
}
