'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import { TwoUnevenColumns } from '@/components/Layouts/Layouts';
import MediaExplorerList from '@/components/MediaExplorerList/MediaExplorerList';
import { MediaExplorerContextProvider } from '@/contexts/MediaExplorerContext';

/* * */

export default function MediaExplorer({ children }) {
	return (
		<AppAuthenticationCheck permissions={[{ action: 'navigate', scope: 'media' }]} redirect>
			<MediaExplorerContextProvider>
				<TwoUnevenColumns first={<MediaExplorerList />} second={children} />
			</MediaExplorerContextProvider>
		</AppAuthenticationCheck>
	);
}
