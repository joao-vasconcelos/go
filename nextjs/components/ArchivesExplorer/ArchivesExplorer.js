'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import ArchivesExplorerList from '@/components/ArchivesExplorerList/ArchivesExplorerList';
import { OneFullColumn } from '@/components/Layouts/Layouts';
import { ArchivesExplorerContextProvider } from '@/contexts/ArchivesExplorerContext';

/* * */

export default function ArchivesExplorer() {
	return (
		<AppAuthenticationCheck permissions={[{ action: 'navigate', scope: 'archives' }]} redirect>
			<ArchivesExplorerContextProvider>
				<OneFullColumn first={<ArchivesExplorerList />} />
			</ArchivesExplorerContextProvider>
		</AppAuthenticationCheck>
	);
}
