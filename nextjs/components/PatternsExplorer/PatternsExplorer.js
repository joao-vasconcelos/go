'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import { PatternsExplorerContextProvider } from '@/contexts/PatternsExplorerContext';

/* * */

export default function PatternsExplorer({ children }) {
	return (
		<AppAuthenticationCheck permissions={[{ action: 'navigate', scope: 'lines' }]} redirect>
			<PatternsExplorerContextProvider>{children}</PatternsExplorerContextProvider>
		</AppAuthenticationCheck>
	);
}
