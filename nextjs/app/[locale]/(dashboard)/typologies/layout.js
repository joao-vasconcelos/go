'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useSearch from '@/hooks/useSearch';
import useSWR from 'swr';
import API from '@/services/API';
import { TwoUnevenColumns } from '@/components/Layouts/Layouts';
import Pannel from '@/components/Pannel/Pannel';
import ListItem from './listItem';
import { ActionIcon, Menu } from '@mantine/core';
import { IconCirclePlus, IconDots } from '@tabler/icons-react';
import notify from '@/services/notify';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import ErrorDisplay from '@/components/ErrorDisplay';
import { useTranslations } from 'next-intl';
import ListFooter from '@/components/ListFooter/ListFooter';
import AuthGate from '@/components/AuthGate/AuthGate';
import SearchField from '@/components/SearchField/SearchField';
import ListHeader from '@/components/ListHeader/ListHeader';

export default function Layout({ children }) {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const t = useTranslations('typologies');

  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  //
  // B. Fetch data

  const { data: allTypologiesData, error: allTypologiesError, isLoading: allTypologiesLoading, isValidating: allTypologiesValidating, mutate: allTypologiesMutate } = useSWR('/api/typologies');

  //
  // C. Search

  const filteredTypologiesData = useSearch(searchQuery, allTypologiesData);

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
  // D. Render data

  return (
    <AuthGate scope="typologies" permission="view" redirect>
      <TwoUnevenColumns
        first={
          <Pannel
            loading={allTypologiesLoading}
            header={
              <ListHeader>
                <SearchField query={searchQuery} onChange={setSearchQuery} />
                <Menu shadow="md" position="bottom-end">
                  <Menu.Target>
                    <ActionIcon variant="light" size="lg" color="gray" loading={allTypologiesLoading || isCreating}>
                      <IconDots size={20} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <AuthGate scope="typologies" permission="create_edit">
                      <Menu.Item leftSection={<IconCirclePlus size={20} />} onClick={handleCreate}>
                        {t('operations.create.title')}
                      </Menu.Item>
                    </AuthGate>
                  </Menu.Dropdown>
                </Menu>
              </ListHeader>
            }
            footer={filteredTypologiesData && <ListFooter>{t('list.footer', { count: filteredTypologiesData.length })}</ListFooter>}
          >
            <ErrorDisplay error={allTypologiesError} loading={allTypologiesValidating} />
            {filteredTypologiesData && filteredTypologiesData.length > 0 ? filteredTypologiesData.map((item) => <ListItem key={item._id} _id={item._id} code={item.code} name={item.name} />) : <NoDataLabel />}
          </Pannel>
        }
        second={children}
      />
    </AuthGate>
  );
}
