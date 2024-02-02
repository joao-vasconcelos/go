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
import { useIssuesExplorerContext } from '@/contexts/IssuesExplorerContext';
import ListHeader from '@/components/ListHeader/ListHeader';

/* * */

export default function IssuesExplorerListHeader() {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const t = useTranslations('IssuesExplorerListHeader');
  const [isCreating, setIsCreating] = useState(false);
  const issuesExplorerContext = useIssuesExplorerContext();

  //
  // B. Fetch data

  const { isLoading: allIssuesLoading, mutate: allIssuesMutate } = useSWR('/api/issues');

  //
  // C. Handle actions

  const handleCreate = async () => {
    try {
      setIsCreating(true);
      notify('new', 'loading', t('operations.create.loading'));
      const response = await API({ service: 'issues', operation: 'create', method: 'GET' });
      allIssuesMutate();
      router.push(`/dashboard/issues/${response._id}`);
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
      <SearchField query={issuesExplorerContext.list.search_query} onChange={issuesExplorerContext.updateSearchQuery} />
      <Menu shadow="md" position="bottom-end">
        <Menu.Target>
          <ActionIcon variant="light" size="lg" color="gray" loading={allIssuesLoading || isCreating}>
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
