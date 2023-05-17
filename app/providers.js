'use client';

import { SessionProvider } from 'next-auth/react';
import { MantineProvider } from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';

export default function Providers({ children, session }) {
  //

  // hook will return either 'dark' or 'light' on client
  // and always 'light' during ssr as window.matchMedia is not available
  const preferredColorScheme = useColorScheme();

  return (
    <SessionProvider session={session}>
      <MantineProvider theme={{ colorScheme: preferredColorScheme }} withGlobalStyles withNormalizeCSS>
        {children}
      </MantineProvider>
    </SessionProvider>
  );
}
