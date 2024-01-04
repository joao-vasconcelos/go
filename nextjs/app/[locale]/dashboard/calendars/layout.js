'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import API from '@/services/API';
import { TwoUnevenColumns } from '@/components/Layouts/Layouts';
import Pannel from '@/components/Pannel/Pannel';
import ListItem from './listItem';
import { ActionIcon, Menu, MenuDivider } from '@mantine/core';
import { IconCirclePlus, IconDots, IconPencil } from '@tabler/icons-react';
import notify from '@/services/notify';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import ErrorDisplay from '@/components/ErrorDisplay';
import { useTranslations } from 'next-intl';
import ListFooter from '@/components/ListFooter/ListFooter';
import AuthGate from '@/components/AuthGate/AuthGate';
import SearchField from '@/components/SearchField/SearchField';
import useSearch from '@/hooks/useSearch';

export default function Layout({ children }) {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const t = useTranslations('calendars');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  //
  // B. Fetch data

  const { data: allCalendarsData, error: allCalendarsError, isLoading: allCalendarsLoading, isValidating: allCalendarsValidating, mutate: allCalendarsMutate } = useSWR('/api/calendars');

  //
  // C. Search

  const filteredCalendarsData = useSearch(searchQuery, allCalendarsData, { keys: ['code', 'name'] });

  //
  // C. Handle actions

  const handleCreate = async () => {
    try {
      setIsCreating(true);
      notify('new', 'loading', t('operations.create.loading'));
      const response = await API({ service: 'calendars', operation: 'create', method: 'GET' });
      allCalendarsMutate();
      router.push(`/dashboard/calendars/${response._id}`);
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
    <AuthGate scope="calendars" permission="view" redirect>
      <TwoUnevenColumns
        first={
          <Pannel
            loading={allCalendarsLoading}
            header={
              <>
                <SearchField query={searchQuery} onChange={setSearchQuery} />
                <Menu shadow="md" position="bottom-end">
                  <Menu.Target>
                    <ActionIcon variant="light" size="lg" color="gray" loading={allCalendarsLoading || isCreating}>
                      <IconDots size={20} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item leftSection={<IconCirclePlus size={20} />} onClick={handleCreate}>
                      {t('operations.create.title')}
                    </Menu.Item>
                    <Menu.Divider />
                    <AuthGate scope="dates" permission="view">
                      <Menu.Item leftSection={<IconPencil size={20} />} onClick={() => router.push('/dashboard/dates')}>
                        Editar Datas
                      </Menu.Item>
                    </AuthGate>
                  </Menu.Dropdown>
                </Menu>
              </>
            }
            footer={filteredCalendarsData && <ListFooter>{t('list.footer', { count: filteredCalendarsData.length })}</ListFooter>}
          >
            <ErrorDisplay error={allCalendarsError} loading={allCalendarsValidating} />
            {filteredCalendarsData && filteredCalendarsData.length > 0 ? filteredCalendarsData.map((item) => <ListItem key={item._id} _id={item._id} code={item.code} name={item.name} />) : <NoDataLabel />}
          </Pannel>
        }
        second={children}
      />
    </AuthGate>
  );
}
