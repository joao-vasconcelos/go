'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import useSearch from '@/hooks/useSearch';

export default function Layout({ children }) {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const t = useTranslations('threads');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  //
  // B. Fetch data

  const { data: allThreadsData, error: allThreadsError, isLoading: allThreadsLoading, isValidating: allThreadsValidating, mutate: allThreadsMutate } = useSWR('/api/threads');

  //
  // C. Search

  const filteredThreadsData = useSearch(searchQuery, allThreadsData, { keys: ['subject', 'theme'] });

  //
  // C. Handle actions

  const handleCreateThread = async () => {
    try {
      setIsCreating(true);
      notify('new', 'loading', t('operations.create.loading'));
      const response = await API({ service: 'threads', operation: 'create', method: 'GET' });
      allThreadsMutate();
      router.push(`/dashboard/threads/${response._id}`);
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
    <AuthGate scope="threads" permission="view" redirect>
      <TwoUnevenColumns
        first={
          <Pannel
            loading={allThreadsLoading}
            header={
              <>
                <SearchField placeholder="Procurar..." width={'100%'} />
                <Menu shadow="md" position="bottom-end">
                  <Menu.Target>
                    <ActionIcon variant="light" size="lg" color="gray" loading={allThreadsLoading || isCreating}>
                      <IconDots size={20} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <AuthGate permission="threads_create">
                      <Menu.Item leftSection={<IconCirclePlus size={20} />} onClick={handleCreateThread}>
                        {t('operations.create.title')}
                      </Menu.Item>
                    </AuthGate>
                  </Menu.Dropdown>
                </Menu>
              </>
            }
            footer={filteredThreadsData && <ListFooter>{t('list.footer', { count: filteredThreadsData.length })}</ListFooter>}
          >
            <ErrorDisplay error={allThreadsError} loading={allThreadsValidating} />
            {filteredThreadsData && filteredThreadsData.length > 0 ? filteredThreadsData.map((item) => <ListItem key={item._id} _id={item._id} subject={item.subject} />) : <NoDataLabel />}
          </Pannel>
        }
        second={children}
      />
    </AuthGate>
  );
}
