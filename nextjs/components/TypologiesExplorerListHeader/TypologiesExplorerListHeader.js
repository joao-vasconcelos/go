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
import { useTypologiesExplorerContext } from '@/contexts/TypologiesExplorerContext';
import ListHeader from '@/components/ListHeader/ListHeader';

/* * */

export default function TypologiesExplorerListHeader() {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const t = useTranslations('TypologiesExplorerListHeader');
  const [isCreating, setIsCreating] = useState(false);
  const typologiesExplorerContext = useTypologiesExplorerContext();

  //
  // B. Fetch data

  const { isLoading: allTypologiesLoading, mutate: allTypologiesMutate } = useSWR('/api/typologies');

  //
  // C. Handle actions

  const handleCreate = async () => {
    try {
      setIsCreating(true);
      notify('new', 'loading', t('operations.create.loading'));
      const response = await API({ service: 'typologies', operation: 'create', method: 'GET' });
      allTypologiesMutate();
      router.push(`/typologies/${response._id}`);
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
      <SearchField query={typologiesExplorerContext.list.search_query} onChange={typologiesExplorerContext.updateSearchQuery} />
      <Menu shadow="md" position="bottom-end">
        <Menu.Target>
          <ActionIcon variant="light" size="lg" color="gray" loading={allTypologiesLoading || isCreating}>
            <IconDots size={20} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <AppAuthenticationCheck permissions={[{ scope: 'typologies', action: 'create' }]}>
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
