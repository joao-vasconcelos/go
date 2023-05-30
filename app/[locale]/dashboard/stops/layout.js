'use client';

import { styled } from '@stitches/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';
import API from '../../../../services/API';
import { TwoUnevenColumns } from '../../../../components/Layouts/Layouts';
import Pannel from '../../../../components/Pannel/Pannel';
import ListItem from './listItem';
import { TextInput, ActionIcon, Menu } from '@mantine/core';
import { IconCirclePlus, IconDots, IconPencil } from '@tabler/icons-react';
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
  const t = useTranslations('stops');

  const [isCreating, setIsCreating] = useState(false);

  //
  // B. Fetch data

  const { data: stopsData, error: stopsError, isLoading: stopsLoading, isValidating: stopsValidating } = useSWR('/api/stops');

  //
  // C. Handle actions

  const handleCreateStop = async () => {
    try {
      setIsCreating(true);
      notify('new', 'loading', t('operations.create.loading'));
      const response = await API({ service: 'stops', operation: 'create', method: 'GET' });
      router.push(`/dashboard/stops/${response._id}`);
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
    <AuthGate scope='stops' permission='view' redirect>
      <TwoUnevenColumns
        first={
          <Pannel
            loading={stopsLoading}
            header={
              <>
                <SearchField placeholder='Procurar...' width={'100%'} />
                <Menu shadow='md' position='bottom-end'>
                  <Menu.Target>
                    <ActionIcon variant='light' size='lg' loading={stopsLoading || isCreating}>
                      <IconDots size='20px' />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Label>Importar</Menu.Label>
                    <AuthGate scope='stops' permission='create_edit'>
                      <Menu.Item icon={<IconCirclePlus size='20px' />} onClick={handleCreateStop}>
                        {t('operations.create.title')}
                      </Menu.Item>
                    </AuthGate>
                    <AuthGate scope='municipalities' permission='view'>
                      <Menu.Label>Dados Relacionados</Menu.Label>
                      <Menu.Item icon={<IconPencil size='20px' />} onClick={() => router.push('/dashboard/municipalities')}>
                        Editar Municípios
                      </Menu.Item>
                    </AuthGate>
                  </Menu.Dropdown>
                </Menu>
              </>
            }
            footer={stopsData && <ListFooter>{t('list.footer', { count: stopsData.length })}</ListFooter>}
          >
            <ErrorDisplay error={stopsError} loading={stopsValidating} />
            {stopsData && stopsData.length > 0 ? (
              <AutoSizer>
                {({ height, width }) => (
                  <List className='List' height={height} itemCount={stopsData.length} itemSize={85} width={width}>
                    {({ index, style }) => (
                      <ListItem key={stopsData[index]._id} style={style} _id={stopsData[index]._id} code={stopsData[index].code} name={stopsData[index].name} latitude={stopsData[index].latitude} longitude={stopsData[index].longitude} />
                    )}
                  </List>
                )}
              </AutoSizer>
            ) : (
              <NoDataLabel />
            )}
          </Pannel>
        }
        second={children}
      />
    </AuthGate>
  );
}
