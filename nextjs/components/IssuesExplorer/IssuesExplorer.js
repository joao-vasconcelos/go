'use client';

/* * */

import AuthGate from '@/components/AuthGate/AuthGate';
import { TwoUnevenColumns } from '@/components/Layouts/Layouts';
import IssuesExplorerList from '@/components/IssuesExplorerList/IssuesExplorerList';
import { IssuesExplorerContextProvider } from '@/contexts/IssuesExplorerContext';

/* * */

export default function IssuesExplorer({ children }) {
  return (
    <AuthGate scope="issues" permission="view" redirect>
      <IssuesExplorerContextProvider>
        <TwoUnevenColumns first={<IssuesExplorerList />} second={children} />
      </IssuesExplorerContextProvider>
    </AuthGate>
  );
}
