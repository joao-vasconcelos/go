'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import { OneFullColumn } from '@/components/Layouts/Layouts';
import { IssuesExplorerContextProvider } from '@/contexts/IssuesExplorerContext';

/* * */

export default function IssuesExplorer({ children }) {
  return (
    <AppAuthenticationCheck permissions={[{ scope: 'issues', action: 'navigate' }]} redirect>
      <IssuesExplorerContextProvider>
        <OneFullColumn first={children} />
      </IssuesExplorerContextProvider>
    </AppAuthenticationCheck>
  );
}
