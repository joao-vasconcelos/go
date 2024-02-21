'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import { TwoUnevenColumns } from '@/components/Layouts/Layouts';
import UsersExplorerList from '@/components/UsersExplorerList/UsersExplorerList';
import { UsersExplorerContextProvider } from '@/contexts/UsersExplorerContext';

/* * */

export default function UsersExplorer({ children }) {
  return (
    // <AppAuthenticationCheck permissions={[{ scope: 'users', action: 'navigate' }]} redirect>
    <UsersExplorerContextProvider>
      <TwoUnevenColumns first={<UsersExplorerList />} second={children} />
    </UsersExplorerContextProvider>
    // </AppAuthenticationCheck>
  );
}
