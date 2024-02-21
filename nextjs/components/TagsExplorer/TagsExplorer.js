'use client';

/* * */

import AuthGateNew from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import { TwoUnevenColumns } from '@/components/Layouts/Layouts';
import TagsExplorerList from '@/components/TagsExplorerList/TagsExplorerList';
import { TagsExplorerContextProvider } from '@/contexts/TagsExplorerContext';

/* * */

export default function TagsExplorer({ children }) {
  return (
    <AuthGateNew permissions={[{ scope: 'tags', action: 'navigate' }]} redirect>
      <TagsExplorerContextProvider>
        <TwoUnevenColumns first={<TagsExplorerList />} second={children} />
      </TagsExplorerContextProvider>
    </AuthGateNew>
  );
}
