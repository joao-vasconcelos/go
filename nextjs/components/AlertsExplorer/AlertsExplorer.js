'use client';

/* * */

import AlertsExplorerList from '@/components/AlertsExplorerList/AlertsExplorerList';
import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import { TwoUnevenColumns } from '@/components/Layouts/Layouts';
import { AlertsExplorerContextProvider } from '@/contexts/AlertsExplorerContext';

/* * */

export default function AlertsExplorer({ children }) {
	return (
		<AppAuthenticationCheck permissions={[{ action: 'navigate', scope: 'alerts' }]} redirect>
			<AlertsExplorerContextProvider>
				<TwoUnevenColumns first={<AlertsExplorerList />} second={children} />
			</AlertsExplorerContextProvider>
		</AppAuthenticationCheck>
	);
}
