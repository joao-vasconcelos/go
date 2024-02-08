'use client';

/* * */

import AuthGate from '@/components/AuthGate/AuthGate';
import { TwoUnevenColumns } from '@/components/Layouts/Layouts';
import AlertsExplorerList from '@/components/AlertsExplorerList/AlertsExplorerList';
import { AlertsExplorerContextProvider } from '@/contexts/AlertsExplorerContext';

/* * */

export default function AlertsExplorer({ children }) {
  return (
    <AuthGate scope="alerts" permission="view" redirect>
      <AlertsExplorerContextProvider>
        <TwoUnevenColumns first={<AlertsExplorerList />} second={children} />
      </AlertsExplorerContextProvider>
    </AuthGate>
  );
}
