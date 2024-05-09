'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import { OneFullColumn } from '@/components/Layouts/Layouts';
import { ArchivesExplorerContextProvider } from '@/contexts/ArchivesExplorerContext';
import ArchivesExplorerList from '@/components/ArchivesExplorerList/ArchivesExplorerList';

/* * */

export default function ArchivesExplorer() {
	return (
		<AppAuthenticationCheck permissions={[{ scope: 'archives', action: 'navigate' }]} redirect>
			<ArchivesExplorerContextProvider>
				<OneFullColumn first={<ArchivesExplorerList />} />
			</ArchivesExplorerContextProvider>
		</AppAuthenticationCheck>
	);
}