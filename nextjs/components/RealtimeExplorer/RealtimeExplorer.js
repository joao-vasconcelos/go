'use client';

/* * */

import AuthGate from '@/components/AuthGate/AuthGate';
import { TwoUnevenColumns } from '@/components/Layouts/Layouts';
import RealtimeExplorerResult from '@/components/RealtimeExplorerResult/RealtimeExplorerResult';
import { RealtimeExplorerContextProvider } from '@/contexts/RealtimeExplorerContext';
import RealtimeExplorerForm from '@/components/RealtimeExplorerForm/RealtimeExplorerForm';

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
