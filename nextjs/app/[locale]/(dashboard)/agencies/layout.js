'use client';

import { useState } from 'react';
import { useRouter } from '@/translations/navigation';
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
import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import SearchField from '@/components/SearchField/SearchField';
import ListHeader from '@/components/ListHeader/ListHeader';

export default function Layout({ children }) {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const t = useTranslations('agencies');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  //
  // B. Fetch data

  const { data: allAgenciesData, error: allAgenciesError, isLoading: allAgenciesLoading, isValidating: allAgenciesValidating, mutate: allAgenciesMutate } = useSWR('/api/agencies');

  //
  // C. Search

  const filteredAgenciesData = useSearch(searchQuery, allAgenciesData, { keys: ['name', 'code'] });

  //
  // C. Handle actions

  const handleCreate = async () => {
    try {
      setIsCreating(true);
      notify('new', 'loading', t('operations.create.loading'));
      const response = await API({ service: 'agencies', operation: 'create', method: 'GET' });
      allAgenciesMutate();
      router.push(`/agencies/${response._id}`);
      notify('new', 'success', t('operations.create.success'));
      setIsCreating(false);
    } catch (error) {
      notify('new', 'error', err.message || t('operations.create.error'));
      setIsCreating(false);
      console.log(error);
    }
  };

  //
  // D. Render data

  return (
    <AppAuthenticationCheck permissions={[{ scope: 'agencies', action: 'navigate' }]} redirect>
      <TwoUnevenColumns
        first={
          <Pannel
            loading={allAgenciesLoading}
            header={
              <ListHeader>
                <SearchField query={searchQuery} onChange={setSearchQuery} />
                <Menu shadow="md" position="bottom-end">
                  <Menu.Target>
                    <ActionIcon variant="light" size="lg" color="gray" loading={allAgenciesLoading || isCreating}>
                      <IconDots size={20} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <AppAuthenticationCheck permissions={[{ scope: 'agencies', action: 'create' }]}>
                      <Menu.Item leftSection={<IconCirclePlus size={20} />} onClick={handleCreate}>
                        {t('operations.create.title')}
                      </Menu.Item>
                    </AppAuthenticationCheck>
                  </Menu.Dropdown>
                </Menu>
              </ListHeader>
            }
            footer={filteredAgenciesData && <ListFooter>{t('list.footer', { count: filteredAgenciesData.length })}</ListFooter>}
          >
            <ErrorDisplay error={allAgenciesError} loading={allAgenciesValidating} />
            {filteredAgenciesData && filteredAgenciesData.length > 0 ? filteredAgenciesData.map((item) => <ListItem key={item._id} _id={item._id} name={item.name} />) : <NoDataLabel />}
          </Pannel>
        }
        second={children}
      />
    </AppAuthenticationCheck>
  );
}
