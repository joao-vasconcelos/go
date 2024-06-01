'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import ArchivesExplorerListItemEdit from '@/components/ArchivesExplorerListItemEdit/ArchivesExplorerListItemEdit';
import ArchivesExplorerListItemFiles from '@/components/ArchivesExplorerListItemFiles/ArchivesExplorerListItemFiles';
import ArchivesExplorerListItemHeader from '@/components/ArchivesExplorerListItemHeader/ArchivesExplorerListItemHeader';
import Standout from '@/components/Standout/Standout';
import { ArchivesExplorerItemContextProvider } from '@/contexts/ArchivesExplorerItemContext';

/* * */

export default function ArchivesExplorerListItem({ item }) {
	return (
		<ArchivesExplorerItemContextProvider itemData={item} itemId={item._id}>
			<Standout defaultOpen={false} icon={<ArchivesExplorerListItemHeader />} collapsible>
				<AppAuthenticationCheck permissions={[{ action: 'edit', scope: 'archives' }]}>
					<ArchivesExplorerListItemEdit />
				</AppAuthenticationCheck>
				<ArchivesExplorerListItemFiles />
			</Standout>
		</ArchivesExplorerItemContextProvider>
	);
}
