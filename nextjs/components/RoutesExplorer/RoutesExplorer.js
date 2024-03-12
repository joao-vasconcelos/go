'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import { RoutesExplorerContextProvider } from '@/contexts/RoutesExplorerContext';

/* * */

export default function RoutesExplorer({ children }) {
  return (
    <AppAuthenticationCheck permissions={[{ scope: 'lines', action: 'navigate' }]} redirect>
      <RoutesExplorerContextProvider>{children}</RoutesExplorerContextProvider>
    </AppAuthenticationCheck>
  );
}
