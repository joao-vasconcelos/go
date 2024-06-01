'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import { TwoUnevenColumns } from '@/components/Layouts/Layouts';
import UsersExplorerList from '@/components/UsersExplorerList/UsersExplorerList';
import { UsersExplorerContextProvider } from '@/contexts/UsersExplorerContext';

/* * */

export default function UsersExplorer({ children }) {
	return (
		<AppAuthenticationCheck permissions={[{ action: 'navigate', scope: 'users' }]} redirect>
			<UsersExplorerContextProvider>
				<TwoUnevenColumns first={<UsersExplorerList />} second={children} />
			</UsersExplorerContextProvider>
		</AppAuthenticationCheck>
	);
}
