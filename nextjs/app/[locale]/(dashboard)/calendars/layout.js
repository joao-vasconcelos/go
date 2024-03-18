'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import API from '@/services/API';
import { TwoUnevenColumns } from '@/components/Layouts/Layouts';
import Pannel from '@/components/Pannel/Pannel';
import ListItem from './listItem';
import { ActionIcon, Menu } from '@mantine/core';
import { IconCirclePlus, IconDots, IconDownload } from '@tabler/icons-react';
import notify from '@/services/notify';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import ErrorDisplay from '@/components/ErrorDisplay';
import { useTranslations } from 'next-intl';
import ListFooter from '@/components/ListFooter/ListFooter';
import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import SearchField from '@/components/SearchField/SearchField';
import useSearch from '@/hooks/useSearch';
import ListHeader from '@/components/ListHeader/ListHeader';

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
      router.push(`/calendars/${response._id}`);
      notify('new', 'success', t('operations.create.success'));
      setIsCreating(false);
    } catch (err) {
      notify('new', 'error', err.message || t('operations.create.error'));
      setIsCreating(false);
      console.log(err);
    }
  };

  const handleExportDates = async () => {
    try {
      setIsCreating(true);
      notify('export_dates', 'loading', t('operations.export_dates.loading'));
      const responseBlob = await API({ service: 'calendars', operation: 'export_dates', method: 'GET', parseType: 'blob' });
      const objectURL = URL.createObjectURL(responseBlob);
      const htmlAnchorElement = document.createElement('a');
      htmlAnchorElement.href = objectURL;
      htmlAnchorElement.download = 'dates.txt';
      document.body.appendChild(htmlAnchorElement);
      htmlAnchorElement.click();
      notify('export_dates', 'success', t('operations.export_dates.success'));
      setIsCreating(false);
    } catch (err) {
      notify('export_dates', 'error', err.message || t('operations.export_dates.error'));
      setIsCreating(false);
      console.log(err);
    }
  };

  //
  // D. Render data

  return (
    <AppAuthenticationCheck permissions={[{ scope: 'calendars', action: 'navigate' }]} redirect>
      <TwoUnevenColumns
        first={
          <Pannel
            loading={allCalendarsLoading}
            header={
              <ListHeader>
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
                    <AppAuthenticationCheck permissions={[{ scope: 'calendars', action: 'export_dates' }]}>
                      <Menu.Item leftSection={<IconDownload size={20} />} onClick={handleExportDates}>
                        {t('operations.export_dates.title')}
                      </Menu.Item>
                    </AppAuthenticationCheck>
                  </Menu.Dropdown>
                </Menu>
              </ListHeader>
            }
            footer={filteredCalendarsData && <ListFooter>{t('list.footer', { count: filteredCalendarsData.length })}</ListFooter>}
          >
            <ErrorDisplay error={allCalendarsError} loading={allCalendarsValidating} />
            {filteredCalendarsData && filteredCalendarsData.length > 0 ? filteredCalendarsData.map((item) => <ListItem key={item._id} _id={item._id} code={item.code} name={item.name} />) : <NoDataLabel />}
          </Pannel>
        }
        second={children}
      />
    </AppAuthenticationCheck>
  );
}
