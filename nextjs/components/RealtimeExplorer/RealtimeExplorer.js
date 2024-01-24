'use client';

/* * */

import AuthGate from '@/components/AuthGate/AuthGate';
import { TwoEvenColumns } from '@/components/Layouts/Layouts';
import { RealtimeExplorerContextProvider } from '@/contexts/RealtimeExplorerContext';
import RealtimeExplorerOverview from '@/components/RealtimeExplorerOverview/RealtimeExplorerOverview';

/* * */

export default function RealtimeExplorer() {
  return (
    <AuthGate scope="configs" permission="admin" redirect>
      <RealtimeExplorerContextProvider>
        <TwoEvenColumns first={<RealtimeExplorerOverview />} second={<></>} />
      </RealtimeExplorerContextProvider>
    </AuthGate>
  );
}
