'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import { TwoUnevenColumns } from '@/components/Layouts/Layouts';
import AlertsExplorerList from '@/components/AlertsExplorerList/AlertsExplorerList';
import { AlertsExplorerContextProvider } from '@/contexts/AlertsExplorerContext';

/* * */

export default function AlertsExplorer({ children }) {
	return (
		<AppAuthenticationCheck permissions={[{ scope: 'alerts', action: 'navigate' }]} redirect>
			<AlertsExplorerContextProvider>
				<TwoUnevenColumns first={<AlertsExplorerList />} second={children} />
			</AlertsExplorerContextProvider>
		</AppAuthenticationCheck>
	);
}