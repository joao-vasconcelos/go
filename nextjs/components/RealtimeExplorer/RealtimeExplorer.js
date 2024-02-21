'use client';

/* * */

import { TwoUnevenColumns } from '@/components/Layouts/Layouts';
import RealtimeExplorerForm from '@/components/RealtimeExplorerForm/RealtimeExplorerForm';
import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import RealtimeExplorerResult from '@/components/RealtimeExplorerResult/RealtimeExplorerResult';
import { RealtimeExplorerContextProvider } from '@/contexts/RealtimeExplorerContext';

/* * */

export default function RealtimeExplorer() {
  return (
    <AppAuthenticationCheck permission={[{ scope: 'reporting', action: 'view' }]} redirect>
      <RealtimeExplorerContextProvider>
        <TwoUnevenColumns first={<RealtimeExplorerForm />} second={<RealtimeExplorerResult />} />
      </RealtimeExplorerContextProvider>
    </AppAuthenticationCheck>
  );
}
