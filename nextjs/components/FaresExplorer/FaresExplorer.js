'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import { TwoUnevenColumns } from '@/components/Layouts/Layouts';
import FaresExplorerList from '@/components/FaresExplorerList/FaresExplorerList';
import { FaresExplorerContextProvider } from '@/contexts/FaresExplorerContext';

/* * */

export default function FaresExplorer({ children }) {
  return (
    <AppAuthenticationCheck permissions={[{ scope: 'fares', action: 'navigate' }]} redirect>
      <FaresExplorerContextProvider>
        <TwoUnevenColumns first={<FaresExplorerList />} second={children} />
      </FaresExplorerContextProvider>
    </AppAuthenticationCheck>
  );
}
