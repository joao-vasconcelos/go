'use client';

import { styled } from '@stitches/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import API from '../../../../services/API';
import { TwoUnevenColumns } from '../../../../components/Layouts/Layouts';
import Pannel from '../../../../components/Pannel/Pannel';
import ListItem from './listItem';
import { TextInput, ActionIcon, Menu } from '@mantine/core';
import { IconCirclePlus, IconDots } from '@tabler/icons-react';
import notify from '../../../../services/notify';
import NoDataLabel from '../../../../components/NoDataLabel';
import ErrorDisplay from '../../../../components/ErrorDisplay';
import { useTranslations } from 'next-intl';
import ListFooter from '../../../../components/ListFooter/ListFooter';
import AuthGate from '../../../../components/AuthGate/AuthGate';

const SearchField = styled(TextInput, {
  width: '100%',
});

export default function Layout({ children }) {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const t = useTranslations('threads');

  const [isCreating, setIsCreating] = useState(false);

  //
  // B. Fetch data

  const { data: threadsData, error: threadsError, isLoading: threadsLoading, isValidating: threadsValidating } = useSWR('/api/threads');

  //
  // C. Handle actions

  const handleCreateThread = async () => {
    try {
      setIsCreating(true);
      notify('new', 'loading', t('operations.create.loading'));
      const response = await API({ service: 'threads', operation: 'create', method: 'GET' });
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
    <AuthGate permission='threads_view' redirect>
      <TwoUnevenColumns
        first={
          <Pannel
            loading={threadsLoading}
            header={
              <>
                <SearchField placeholder='Procurar...' width={'100%'} />
                <Menu shadow='md' position='bottom-end'>
                  <Menu.Target>
                    <ActionIcon variant='light' size='lg' loading={threadsLoading || isCreating}>
                      <IconDots size='20px' />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <AuthGate permission='threads_create'>
                      <Menu.Label>Importar</Menu.Label>
                      <Menu.Item icon={<IconCirclePlus size='20px' />} onClick={handleCreateThread}>
                        {t('operations.create.title')}
                      </Menu.Item>
                    </AuthGate>
                  </Menu.Dropdown>
                </Menu>
              </>
            }
            footer={threadsData && <ListFooter>{t('list.footer', { count: threadsData.length })}</ListFooter>}
          >
            <ErrorDisplay error={threadsError} loading={threadsValidating} />
            {threadsData && threadsData.length > 0 ? threadsData.map((item) => <ListItem key={item._id} _id={item._id} subject={item.subject} />) : <NoDataLabel />}
          </Pannel>
        }
        second={children}
      />
    </AuthGate>
  );
}
