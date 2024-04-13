'use client';

/* * */

import { ArchivesExplorerItemContextProvider } from '@/contexts/ArchivesExplorerItemContext';
import ArchivesExplorerListItemHeader from '@/components/ArchivesExplorerListItemHeader/ArchivesExplorerListItemHeader';
import ArchivesExplorerListItemEdit from '@/components/ArchivesExplorerListItemEdit/ArchivesExplorerListItemEdit';
import ArchivesExplorerListItemFiles from '@/components/ArchivesExplorerListItemFiles/ArchivesExplorerListItemFiles';
import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import Standout from '@/components/Standout/Standout';

/* * */

export default function ArchivesExplorerListItem({ item }) {
  return (
    <ArchivesExplorerItemContextProvider itemId={item._id} itemData={item}>
      <Standout icon={<ArchivesExplorerListItemHeader />} defaultOpen={false} collapsible>
        <AppAuthenticationCheck permissions={[{ scope: 'archives', action: 'edit' }]}>
          <ArchivesExplorerListItemEdit />
        </AppAuthenticationCheck>
        <ArchivesExplorerListItemFiles />
      </Standout>
    </ArchivesExplorerItemContextProvider>
  );
}
