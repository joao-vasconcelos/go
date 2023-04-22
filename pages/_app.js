import { SWRConfig } from 'swr';
import { SessionProvider } from 'next-auth/react';
import { MantineProvider, AppShell } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import BrowserConfig from '../components/BrowserConfig';
import NavigationBar from '../components/NavigationBar';
import { TbHome, TbClipboardCheck, TbLicense, TbChartPie, TbUsers } from 'react-icons/tb';
import AuthChecker from '../components/AuthChecker';
import { Analytics } from '@vercel/analytics/react';

// Styles
import '../styles/reset.css';

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  //

  // SIDEBAR NAVIGATION LINKS
  const navbarLinks = [
    { href: '/', label: 'Home', icon: <TbHome /> },
    { href: '/audits', label: 'Auditorias', icon: <TbClipboardCheck /> },
    // { href: '/reports', label: 'Relatórios', icon: <TbChartPie /> },
    { href: '/templates', label: 'Modelos', icon: <TbLicense /> },
    { href: '/users', label: 'Utilizadores', icon: <TbUsers /> },
  ];

  // SWR CONFIGURATION
  const swrOptions = {
    refreshInterval: 5000,
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
        <BrowserConfig />
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <Notifications />
          <ModalsProvider>
            <AuthChecker
              authenticated={
                <AppShell navbar={<NavigationBar links={navbarLinks} />} style={{ backgroundColor: '#fdfcfd' }}>
                  <Component {...pageProps} />
                </AppShell>
              }
              loading={<p>Loading...</p>}
              unauthenticated={<Component {...pageProps} />}
            />
          </ModalsProvider>
        </MantineProvider>
        <Analytics />
      </SWRConfig>
    </SessionProvider>
  );
}
