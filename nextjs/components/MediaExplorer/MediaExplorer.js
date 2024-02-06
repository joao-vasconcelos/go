'use client';

/* * */

import AuthGate from '@/components/AuthGate/AuthGate';
import { TwoUnevenColumns } from '@/components/Layouts/Layouts';
import MediaExplorerList from '@/components/MediaExplorerList/MediaExplorerList';
import { MediaExplorerContextProvider } from '@/contexts/MediaExplorerContext';

/* * */

export default function MediaExplorer({ children }) {
  return (
    <AuthGate scope="tags" permission="view" redirect>
      <MediaExplorerContextProvider>
        <TwoUnevenColumns first={<MediaExplorerList />} second={children} />
      </MediaExplorerContextProvider>
    </AuthGate>
  );
}
