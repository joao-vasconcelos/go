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
import { IconCirclePlus, IconArrowBarToDown, IconDots, IconPencil } from '@tabler/icons-react';
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
  const t = useTranslations('calendars');

  const [isCreating, setIsCreating] = useState(false);

  //
  // B. Fetch data

  const { data: calendarsData, error: calendarsError, isLoading: calendarsLoading, isValidating: calendarsValidating } = useSWR('/api/calendars');

  //
  // C. Handle actions

  const handleCreateCalendar = async () => {
    try {
      setIsCreating(true);
      notify('new', 'loading', t('operations.create.loading'));
      const response = await API({ service: 'calendars', operation: 'create', method: 'GET' });
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
    <AuthGate permission='calendars_view' redirect>
      <TwoUnevenColumns
        first={
          <Pannel
            loading={calendarsLoading}
            header={
              <>
                <SearchField placeholder='Procurar...' width={'100%'} />
                <Menu shadow='md' position='bottom-end'>
                  <Menu.Target>
                    <ActionIcon variant='light' size='lg' loading={calendarsLoading || isCreating}>
                      <IconDots size='20px' />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Label>Importar</Menu.Label>
                    <Menu.Item icon={<IconCirclePlus size='20px' />} onClick={handleCreateCalendar}>
                      {t('operations.create.title')}
                    </Menu.Item>
                    <Menu.Label>Exportar</Menu.Label>
                    <Menu.Item icon={<IconArrowBarToDown size='20px' />}>Download calendar_dates.txt</Menu.Item>
                    <AuthGate permission='dates_view'>
                      <Menu.Label>Dados Relacionados</Menu.Label>
                      <Menu.Item icon={<IconPencil size='20px' />} onClick={() => router.push('/dashboard/dates')}>
                        Editar Datas
                      </Menu.Item>
                    </AuthGate>
                  </Menu.Dropdown>
                </Menu>
              </>
            }
            footer={calendarsData && <ListFooter>{t('list.footer', { count: calendarsData.length })}</ListFooter>}
          >
            <ErrorDisplay error={calendarsError} loading={calendarsValidating} />
            {calendarsData && calendarsData.length > 0 ? calendarsData.map((item) => <ListItem key={item._id} _id={item._id} code={item.code} name={item.name} />) : <NoDataLabel />}
          </Pannel>
        }
        second={children}
      />
    </AuthGate>
  );
}
