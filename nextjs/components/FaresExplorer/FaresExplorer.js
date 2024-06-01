'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import FaresExplorerList from '@/components/FaresExplorerList/FaresExplorerList';
import { TwoUnevenColumns } from '@/components/Layouts/Layouts';
import { FaresExplorerContextProvider } from '@/contexts/FaresExplorerContext';

/* * */

export default function FaresExplorer({ children }) {
	return (
		<AppAuthenticationCheck permissions={[{ action: 'navigate', scope: 'fares' }]} redirect>
			<FaresExplorerContextProvider>
				<TwoUnevenColumns first={<FaresExplorerList />} second={children} />
			</FaresExplorerContextProvider>
		</AppAuthenticationCheck>
	);
}
