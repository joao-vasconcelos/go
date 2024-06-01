'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import { RoutesExplorerContextProvider } from '@/contexts/RoutesExplorerContext';

/* * */

export default function RoutesExplorer({ children }) {
	return (
		<AppAuthenticationCheck permissions={[{ action: 'navigate', scope: 'lines' }]} redirect>
			<RoutesExplorerContextProvider>{children}</RoutesExplorerContextProvider>
		</AppAuthenticationCheck>
	);
}
