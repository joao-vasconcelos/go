'use client';

/* * */

import AuthGate from '@/components/AuthGate/AuthGate';
import { TwoUnevenColumns } from '@/components/Layouts/Layouts';
import RealtimeExplorerResult from '@/components/RealtimeExplorerResult/RealtimeExplorerResult';
import RealtimeExplorerForm from '@/components/RealtimeExplorerForm/RealtimeExplorerForm';
import { RealtimeExplorerContextProvider } from '@/contexts/RealtimeExplorerContext';

/* * */

export default function RealtimeExplorer() {
  return (
    <AuthGate scope="configs" permission="admin" redirect>
      <RealtimeExplorerContextProvider>
        <TwoUnevenColumns first={<RealtimeExplorerForm />} second={<RealtimeExplorerResult />} />
      </RealtimeExplorerContextProvider>
    </AuthGate>
  );
}
