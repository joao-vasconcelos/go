'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import ExportsExplorerForm from '@/components/ExportsExplorerForm/ExportsExplorerForm';
import ExportsExplorerList from '@/components/ExportsExplorerList/ExportsExplorerList';
import { TwoEvenColumns } from '@/components/Layouts/Layouts';
import { ExportsExplorerContextProvider } from '@/contexts/ExportsExplorerContext';

/* * */

export default function ExportsExplorer() {
	return (
		<AppAuthenticationCheck permissions={[{ action: 'navigate', scope: 'exports' }]} redirect>
			<ExportsExplorerContextProvider>
				<TwoEvenColumns first={<ExportsExplorerList />} second={<ExportsExplorerForm />} />
			</ExportsExplorerContextProvider>
		</AppAuthenticationCheck>
	);
}
