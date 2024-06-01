'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import { TwoUnevenColumns } from '@/components/Layouts/Layouts';
import StopsExplorerList from '@/components/StopsExplorerList/StopsExplorerList';
import { StopsExplorerContextProvider } from '@/contexts/StopsExplorerContext';
import { StopsExplorerNewStopWizardContextProvider } from '@/contexts/StopsExplorerNewStopWizardContext';

/* * */

export default function StopsExplorer({ children }) {
	return (
		<AppAuthenticationCheck permissions={[{ action: 'navigate', scope: 'stops' }]} redirect>
			<StopsExplorerContextProvider>
				<StopsExplorerNewStopWizardContextProvider>
					<TwoUnevenColumns first={<StopsExplorerList />} second={children} />
				</StopsExplorerNewStopWizardContextProvider>
			</StopsExplorerContextProvider>
		</AppAuthenticationCheck>
	);
}
