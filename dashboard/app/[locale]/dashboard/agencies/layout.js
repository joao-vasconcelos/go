'use client';

import { useState } from 'react';
import { useRouter } from 'next-intl/client';
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
      router.push(`/dashboard/agencies/${response._id}`);
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
    <AuthGate scope="agencies" permission="view" redirect>
      <TwoUnevenColumns
        first={
          <Pannel
            loading={allAgenciesLoading}
            header={
              <>
                <SearchField query={searchQuery} onChange={setSearchQuery} />
                <Menu shadow="md" position="bottom-end">
                  <Menu.Target>
                    <ActionIcon variant="light" size="lg" color="gray" loading={allAgenciesLoading || isCreating}>
                      <IconDots size={20} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <AuthGate scope="agencies" permission="create_edit">
                      <Menu.Item leftSection={<IconCirclePlus size={20} />} onClick={handleCreate}>
                        {t('operations.create.title')}
                      </Menu.Item>
                    </AuthGate>
                  </Menu.Dropdown>
                </Menu>
              </>
            }
            footer={filteredAgenciesData && <ListFooter>{t('list.footer', { count: filteredAgenciesData.length })}</ListFooter>}
          >
            <ErrorDisplay error={allAgenciesError} loading={allAgenciesValidating} />
            {filteredAgenciesData && filteredAgenciesData.length > 0 ? filteredAgenciesData.map((item) => <ListItem key={item._id} _id={item._id} name={item.name} />) : <NoDataLabel />}
          </Pannel>
        }
        second={children}
      />
    </AuthGate>
  );
}
