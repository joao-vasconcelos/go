import { SWRConfig } from 'swr';
import { MantineProvider, AppShell } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import BrowserConfig from '../components/BrowserConfig';
import NavigationBar from '../components/NavigationBar';
import { TbHome, TbFlag3, TbClick, TbClipboardCheck, TbLicense } from 'react-icons/tb';

// Styles
import '../styles/reset.css';

export default function App({ Component, pageProps }) {
  //

  // SIDEBAR NAVIGATION LINKS
  const navbarLinks = [
    { href: '/', label: 'Home', icon: TbHome },
    { href: '/stops', label: 'Stops', icon: TbFlag3 },
    { href: '/audits', label: 'Audits', icon: TbClipboardCheck },
    { href: '/surveys', label: 'Surveys', icon: TbLicense },
    { href: '/gtfs', label: 'GTFS Publisher', icon: TbClick },
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
    <SWRConfig value={swrOptions}>
      <BrowserConfig />
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <NotificationsProvider position='top-right'>
          <ModalsProvider>
            <AppShell
              navbar={<NavigationBar links={navbarLinks} />}
              style={{ padding: '15px', backgroundColor: '#fdfcfd' }}
            >
              <Component {...pageProps} />
            </AppShell>
          </ModalsProvider>
        </NotificationsProvider>
      </MantineProvider>
    </SWRConfig>
  );
}
