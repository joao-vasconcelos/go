'use client';

/* * */

import { ExportsExplorerContextProvider } from '@/contexts/ExportsExplorerContext';
import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import ExportsExplorerList from '@/components/ExportsExplorerList/ExportsExplorerList';
import ExportsExplorerForm from '@/components/ExportsExplorerForm/ExportsExplorerForm';
import { TwoEvenColumns } from '@/components/Layouts/Layouts';

/* * */

export default function ExportsExplorer() {
	return (
		<AppAuthenticationCheck permissions={[{ scope: 'exports', action: 'navigate' }]} redirect>
			<ExportsExplorerContextProvider>
				<TwoEvenColumns first={<ExportsExplorerList />} second={<ExportsExplorerForm />} />
			</ExportsExplorerContextProvider>
		</AppAuthenticationCheck>
	);
}