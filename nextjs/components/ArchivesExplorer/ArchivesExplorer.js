'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import { OneFullColumn } from '@/components/Layouts/Layouts';
// import ArchivesExplorerList from '@/components/ArchivesExplorerList/ArchivesExplorerList';
import { ArchivesExplorerContextProvider } from '@/contexts/ArchivesExplorerContext';

/* * */

export default function ArchivesExplorer() {
  return (
    <AppAuthenticationCheck permissions={[{ scope: 'archives', action: 'navigate' }]} redirect>
      <ArchivesExplorerContextProvider>
        ugduy
        {/* <OneFullColumn first={<ArchivesExplorerList />} /> */}
      </ArchivesExplorerContextProvider>
    </AppAuthenticationCheck>
  );
}
