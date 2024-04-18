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
import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import SearchField from '@/components/SearchField/SearchField';
import { useFaresExplorerContext } from '@/contexts/FaresExplorerContext';
import ListHeader from '@/components/ListHeader/ListHeader';

/* * */

export default function FaresExplorerListHeader() {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const t = useTranslations('FaresExplorerListHeader');
  const [isCreating, setIsCreating] = useState(false);
  const faresExplorerContext = useFaresExplorerContext();

  //
  // B. Fetch data

  const { isLoading: allFaresLoading, mutate: allFaresMutate } = useSWR('/api/fares');

  //
  // C. Handle actions

  const handleCreate = async () => {
    try {
      setIsCreating(true);
      notify('new', 'loading', t('operations.create.loading'));
      const response = await API({ service: 'fares', operation: 'create', method: 'GET' });
      allFaresMutate();
      router.push(`/fares/${response._id}`);
      notify('new', 'success', t('operations.create.success'));
      setIsCreating(false);
    } catch (error) {
      notify('new', 'error', err.message || t('operations.create.error'));
      setIsCreating(false);
      console.log(error);
    }
  };

  //
  // D. Render components

  return (
    <ListHeader>
      <SearchField query={faresExplorerContext.list.search_query} onChange={faresExplorerContext.updateSearchQuery} />
      <Menu shadow="md" position="bottom-end">
        <Menu.Target>
          <ActionIcon variant="light" size="lg" color="gray" loading={allFaresLoading || isCreating}>
            <IconDots size={20} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <AppAuthenticationCheck permissions={[{ scope: 'fares', action: 'create' }]}>
            <Menu.Item leftSection={<IconCirclePlus size={20} />} onClick={handleCreate}>
              {t('operations.create.title')}
            </Menu.Item>
          </AppAuthenticationCheck>
        </Menu.Dropdown>
      </Menu>
    </ListHeader>
  );

  //
}
