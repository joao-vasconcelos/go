'use client';

import useSWR from 'swr';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import SearchField from '@/components/SearchField/SearchField';
import useSearch from '@/hooks/useSearch';
import ListHeader from '@/components/ListHeader/ListHeader';
import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';

export default function Layout({ children }) {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const t = useTranslations('lines');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  //
  // B. Fetch data

  const { data: allLinesData, error: allLinesError, isLoading: allLinesLoading, isValidating: allLinesValidating, mutate: allLinesMutate } = useSWR('/api/lines');

  //
  // C. Search

  const allLinesFiltered = useSearch(searchQuery, allLinesData, { keys: ['code', 'short_name', 'name'] });

  //
  // C. Handle actions

  const handleCreate = async () => {
    try {
      setIsCreating(true);
      notify('new', 'loading', t('operations.create.loading'));
      const response = await API({ service: 'lines', operation: 'create', method: 'GET' });
      allLinesMutate();
      router.push(`/lines/${response._id}`);
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
    <AppAuthenticationCheck permissions={[{ scope: 'lines', action: 'navigate' }]} redirect>
      <TwoUnevenColumns
        first={
          <Pannel
            loading={allLinesLoading}
            header={
              <ListHeader>
                <SearchField query={searchQuery} onChange={setSearchQuery} />
                <Menu shadow="md" position="bottom-end">
                  <Menu.Target>
                    <ActionIcon variant="light" size="lg" color="gray" loading={allLinesLoading || isCreating}>
                      <IconDots size={20} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <AppAuthenticationCheck permissions={[{ scope: 'lines', action: 'create' }]}>
                      <Menu.Item leftSection={<IconCirclePlus size={20} />} onClick={handleCreate}>
                        {t('operations.create.title')}
                      </Menu.Item>
                    </AppAuthenticationCheck>
                  </Menu.Dropdown>
                </Menu>
              </ListHeader>
            }
            footer={allLinesFiltered && <ListFooter>{t('list.footer', { count: allLinesFiltered.length })}</ListFooter>}
          >
            <ErrorDisplay error={allLinesError} loading={allLinesValidating} />
            {allLinesFiltered && allLinesFiltered.length > 0 ? allLinesFiltered.map((item) => <ListItem key={item._id} _id={item._id} short_name={item.short_name} name={item.name} color={item.typology?.color} text_color={item.typology?.text_color} />) : <NoDataLabel />}
          </Pannel>
        }
        second={children}
      />
    </AppAuthenticationCheck>
  );
}
