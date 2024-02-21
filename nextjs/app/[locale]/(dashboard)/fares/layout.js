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
import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import SearchField from '@/components/SearchField/SearchField';
import ListHeader from '@/components/ListHeader/ListHeader';

export default function Layout({ children }) {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const t = useTranslations('fares');

  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  //
  // B. Fetch data

  const { data: allFaresData, error: allFaresError, isLoading: allFaresLoading, isValidating: allFaresValidating, mutate: allFaresMutate } = useSWR('/api/fares');

  //
  // C. Search

  const filteredFaresData = useSearch(searchQuery, allFaresData);

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
    } catch (err) {
      notify('new', 'error', err.message || t('operations.create.error'));
      setIsCreating(false);
      console.log(err);
    }
  };

  //
  // D. Render data

  return (
    <AppAuthenticationCheck permissions={[{ scope: 'fares', action: 'navigate' }]} redirect>
      <TwoUnevenColumns
        first={
          <Pannel
            loading={allFaresLoading}
            header={
              <ListHeader>
                <SearchField query={searchQuery} onChange={setSearchQuery} />
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
            }
            footer={filteredFaresData && <ListFooter>{t('list.footer', { count: filteredFaresData.length })}</ListFooter>}
          >
            <ErrorDisplay error={allFaresError} loading={allFaresValidating} />
            {filteredFaresData && filteredFaresData.length > 0 ? filteredFaresData.map((item) => <ListItem key={item._id} _id={item._id} code={item.code} short_name={item.short_name} name={item.name} price={item.price} currency_type={item.currency_type} />) : <NoDataLabel />}
          </Pannel>
        }
        second={children}
      />
    </AppAuthenticationCheck>
  );
}
