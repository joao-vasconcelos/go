import { SWRConfig } from 'swr';
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import BrowserConfig from '../components/BrowserConfig';
import Navigation from '../components/Navigation';

// Styles
import '../styles/reset.css';

export default function App({ Component, pageProps }) {
  //

  return (
    <SWRConfig
      value={{
        fetcher: async (...args) => {
          const res = await fetch(...args);
          return res.json();
        },
        refreshInterval: 5000,
      }}
    >
      <BrowserConfig />
      <MantineProvider theme={'light'} withGlobalStyles withNormalizeCSS>
        <NotificationsProvider>
          <Navigation>
            <Component {...pageProps} />
          </Navigation>
        </NotificationsProvider>
      </MantineProvider>
    </SWRConfig>
  );
}
