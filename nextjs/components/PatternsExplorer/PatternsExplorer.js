'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import { PatternsExplorerContextProvider } from '@/contexts/PatternsExplorerContext';

/* * */

export default function PatternsExplorer({ children }) {
	return (
		<AppAuthenticationCheck permissions={[{ scope: 'lines', action: 'navigate' }]} redirect>
			<PatternsExplorerContextProvider>{children}</PatternsExplorerContextProvider>
		</AppAuthenticationCheck>
	);
}