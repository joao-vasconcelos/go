'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import { TwoUnevenColumns } from '@/components/Layouts/Layouts';
import LinesExplorerList from '@/components/LinesExplorerList/LinesExplorerList';
import { LinesExplorerContextProvider } from '@/contexts/LinesExplorerContext';

/* * */

export default function LinesExplorer({ children }) {
	return (
		<AppAuthenticationCheck permissions={[{ action: 'navigate', scope: 'lines' }]} redirect>
			<LinesExplorerContextProvider>
				<TwoUnevenColumns first={<LinesExplorerList />} second={children} />
			</LinesExplorerContextProvider>
		</AppAuthenticationCheck>
	);
}
