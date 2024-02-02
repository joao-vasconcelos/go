'use client';

/* * */

import AuthGate from '@/components/AuthGate/AuthGate';
import { TwoUnevenColumns } from '@/components/Layouts/Layouts';
import TagsExplorerList from '@/components/TagsExplorerList/TagsExplorerList';
import { TagsExplorerContextProvider } from '@/contexts/TagsExplorerContext';

/* * */

export default function TagsExplorer({ children }) {
  return (
    <AuthGate scope="tags" permission="view" redirect>
      <TagsExplorerContextProvider>
        <TwoUnevenColumns first={<TagsExplorerList />} second={children} />
      </TagsExplorerContextProvider>
    </AuthGate>
  );
}
