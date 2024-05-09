'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import { TwoUnevenColumns } from '@/components/Layouts/Layouts';
import TypologiesExplorerList from '@/components/TypologiesExplorerList/TypologiesExplorerList';
import { TypologiesExplorerContextProvider } from '@/contexts/TypologiesExplorerContext';

/* * */

export default function TypologiesExplorer({ children }) {
	return (
		<AppAuthenticationCheck permissions={[{ scope: 'typologies', action: 'navigate' }]} redirect>
			<TypologiesExplorerContextProvider>
				<TwoUnevenColumns first={<TypologiesExplorerList />} second={children} />
			</TypologiesExplorerContextProvider>
		</AppAuthenticationCheck>
	);
}