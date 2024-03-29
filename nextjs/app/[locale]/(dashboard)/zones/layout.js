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
  const t = useTranslations('zones');

  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  //
  // B. Fetch data

  const { data: allZonesData, error: allZonesError, isLoading: allZonesLoading, isValidating: allZonesValidating, mutate: allZonesMutate } = useSWR('/api/zones');

  //
  // C. Search

  const filteredZonesData = useSearch(searchQuery, allZonesData);

  //
  // C. Handle actions

  const handleCreate = async () => {
    try {
      setIsCreating(true);
      notify('new', 'loading', t('operations.create.loading'));
      const response = await API({ service: 'zones', operation: 'create', method: 'GET' });
      allZonesMutate();
      router.push(`/zones/${response._id}`);
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
    <AppAuthenticationCheck permissions={[{ scope: 'zones', action: 'navigate' }]} redirect>
      <TwoUnevenColumns
        first={
          <Pannel
            loading={allZonesLoading}
            header={
              <ListHeader>
                <SearchField query={searchQuery} onChange={setSearchQuery} />
                <Menu shadow="md" position="bottom-end">
                  <Menu.Target>
                    <ActionIcon variant="light" size="lg" color="gray" loading={allZonesLoading || isCreating}>
                      <IconDots size={20} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <AppAuthenticationCheck permissions={[{ scope: 'zones', action: 'create' }]}>
                      <Menu.Item icon={<IconCirclePlus size={20} />} onClick={handleCreate}>
                        {t('operations.create.title')}
                      </Menu.Item>
                    </AppAuthenticationCheck>
                  </Menu.Dropdown>
                </Menu>
              </ListHeader>
            }
            footer={filteredZonesData && <ListFooter>{t('list.footer', { count: filteredZonesData.length })}</ListFooter>}
          >
            <ErrorDisplay error={allZonesError} loading={allZonesValidating} />
            {filteredZonesData && filteredZonesData.length > 0 ? filteredZonesData.map((item) => <ListItem key={item._id} _id={item._id} code={item.code} name={item.name} />) : <NoDataLabel />}
          </Pannel>
        }
        second={children}
      />
    </AppAuthenticationCheck>
  );
}
