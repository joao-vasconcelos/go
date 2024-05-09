'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import { TwoUnevenColumns } from '@/components/Layouts/Layouts';
import MediaExplorerList from '@/components/MediaExplorerList/MediaExplorerList';
import { MediaExplorerContextProvider } from '@/contexts/MediaExplorerContext';

/* * */

export default function MediaExplorer({ children }) {
	return (
		<AppAuthenticationCheck permissions={[{ scope: 'media', action: 'navigate' }]} redirect>
			<MediaExplorerContextProvider>
				<TwoUnevenColumns first={<MediaExplorerList />} second={children} />
			</MediaExplorerContextProvider>
		</AppAuthenticationCheck>
	);
}