'use client';

/* * */

import { useState } from 'react';
import { useRouter } from '@/translations/navigation';
import useSWR from 'swr';
import API from '@/services/API';
import { ActionIcon, Menu } from '@mantine/core';
import { IconCirclePlus, IconDots } from '@tabler/icons-react';
import notify from '@/services/notify';
import { useTranslations } from 'next-intl';
import AuthGate from '@/components/AuthGate/AuthGate';
import SearchField from '@/components/SearchField/SearchField';
import { useTagsExplorerContext } from '@/contexts/TagsExplorerContext';
import ListHeader from '@/components/ListHeader/ListHeader';

/* * */

export default function IssuesExplorerListHeader() {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const t = useTranslations('IssuesExplorerListHeader');
  const [isCreating, setIsCreating] = useState(false);
  const tagsExplorerContext = useTagsExplorerContext();

  //
  // B. Fetch data

  const { isLoading: allTagsLoading, mutate: allTagsMutate } = useSWR('/api/tags');

  //
  // C. Handle actions

  const handleCreate = async () => {
    try {
      setIsCreating(true);
      notify('new', 'loading', t('operations.create.loading'));
      const response = await API({ service: 'tags', operation: 'create', method: 'GET' });
      allTagsMutate();
      router.push(`/dashboard/tags/${response._id}`);
      notify('new', 'success', t('operations.create.success'));
      setIsCreating(false);
    } catch (err) {
      notify('new', 'error', err.message || t('operations.create.error'));
      setIsCreating(false);
      console.log(err);
    }
  };

  //
  // D. Render components

  return (
    <ListHeader>
      <SearchField query={tagsExplorerContext.list.search_query} onChange={tagsExplorerContext.updateSearchQuery} />
      <Menu shadow="md" position="bottom-end">
        <Menu.Target>
          <ActionIcon variant="light" size="lg" color="gray" loading={allTagsLoading || isCreating}>
            <IconDots size={20} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <AuthGate scope="configs" permission="admin">
            <Menu.Item leftSection={<IconCirclePlus size={20} />} onClick={handleCreate}>
              {t('operations.create.title')}
            </Menu.Item>
          </AuthGate>
        </Menu.Dropdown>
      </Menu>
    </ListHeader>
  );

  //
}
