'use client';

/* * */

import AuthGate from '@/components/AuthGate/AuthGate';
import { OneFullColumn } from '@/components/Layouts/Layouts';
import { IssuesExplorerContextProvider } from '@/contexts/IssuesExplorerContext';

/* * */

export default function IssuesExplorer({ children }) {
  return (
    <AuthGate scope="issues" permission="view" redirect>
      <IssuesExplorerContextProvider>
        <OneFullColumn first={children} />
      </IssuesExplorerContextProvider>
    </AuthGate>
  );
}
