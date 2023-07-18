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

export default function Layout({ children }) {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const t = useTranslations('alerts');

  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  //
  // B. Fetch data

  const { data: allAlertsData, error: allAlertsError, isLoading: allAlertsLoading, isValidating: allAlertsValidating, mutate: allAlertsMutate } = useSWR('/api/alerts');

  //
  // C. Search

  const filteredAlertsData = useSearch(searchQuery, allAlertsData);

  //
  // C. Handle actions

  const handleCreate = async () => {
    try {
      setIsCreating(true);
      notify('new', 'loading', t('operations.create.loading'));
      const response = await API({ service: 'alerts', operation: 'create', method: 'GET' });
      allAlertsMutate();
      router.push(`/dashboard/alerts/${response._id}`);
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
    <AuthGate scope='alerts' permission='view' redirect>
      <TwoUnevenColumns
        first={
          <Pannel
            loading={allAlertsLoading}
            header={
              <>
                <SearchField query={searchQuery} onChange={setSearchQuery} />
                <Menu shadow='md' position='bottom-end'>
                  <Menu.Target>
                    <ActionIcon variant='light' size='lg' loading={allAlertsLoading || isCreating}>
                      <IconDots size='20px' />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Label>Importar</Menu.Label>
                    <AuthGate scope='alerts' permission='create_edit'>
                      <Menu.Item icon={<IconCirclePlus size='20px' />} onClick={handleCreate}>
                        {t('operations.create.title')}
                      </Menu.Item>
                    </AuthGate>
                  </Menu.Dropdown>
                </Menu>
              </>
            }
            footer={filteredAlertsData && <ListFooter>{t('list.footer', { count: filteredAlertsData.length })}</ListFooter>}
          >
            <ErrorDisplay error={allAlertsError} loading={allAlertsValidating} />
            {filteredAlertsData && filteredAlertsData.length > 0 ? filteredAlertsData.map((item) => <ListItem key={item._id} _id={item._id} title={item.title} published={item.published} created_by={item.created_by} />) : <NoDataLabel />}
          </Pannel>
        }
        second={children}
      />
    </AuthGate>
  );
}
