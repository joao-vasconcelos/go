'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useSearch from 'go/hooks/useSearch';
import useSWR from 'swr';
import API from '@/services/API';
import { TwoUnevenColumns } from '@/components/Layouts/Layouts';
import Pannel from '@/components/Pannel/Pannel';
import ListItem from './listItem';
import { ActionIcon, Menu } from '@mantine/core';
import { IconCirclePlus, IconArrowBarToDown, IconDots } from '@tabler/icons-react';
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
  const t = useTranslations('users');

  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  //
  // B. Fetch data

  const { data: allUsersData, error: allUsersError, isLoading: allUsersLoading, isValidating: allUsersValidating, mutate: allUsersMutate } = useSWR('/api/users');

  //
  // C. Search

  const filteredUsersData = useSearch(searchQuery, allUsersData, { keys: ['name', 'email', 'phone'] });

  //
  // C. Handle actions

  const handleCreateUser = async () => {
    try {
      setIsCreating(true);
      notify('new', 'loading', t('operations.create.loading'));
      const response = await API({ service: 'users', operation: 'create', method: 'GET' });
      allUsersMutate();
      router.push(`/dashboard/users/${response._id}`);
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
    <AuthGate scope='users' permission='view' redirect>
      <TwoUnevenColumns
        first={
          <Pannel
            loading={allUsersLoading}
            header={
              <>
                <SearchField query={searchQuery} onChange={setSearchQuery} />
                <Menu shadow='md' position='bottom-end'>
                  <Menu.Target>
                    <ActionIcon variant='light' size='lg' loading={allUsersLoading || isCreating}>
                      <IconDots size='20px' />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Label>Importar</Menu.Label>
                    <Menu.Item icon={<IconCirclePlus size='20px' />} onClick={handleCreateUser}>
                      {t('operations.create.title')}
                    </Menu.Item>
                    <Menu.Label>Exportar</Menu.Label>
                    <Menu.Item icon={<IconArrowBarToDown size='20px' />}>Download CSV</Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </>
            }
            footer={filteredUsersData && <ListFooter>{t('list.footer', { count: filteredUsersData.length })}</ListFooter>}
          >
            <ErrorDisplay error={allUsersError} loading={allUsersValidating} />
            {filteredUsersData && filteredUsersData.length > 0 ? filteredUsersData.map((item) => <ListItem key={item._id} _id={item._id} name={item.name} email={item.email} />) : <NoDataLabel />}
          </Pannel>
        }
        second={children}
      />
    </AuthGate>
  );
}
