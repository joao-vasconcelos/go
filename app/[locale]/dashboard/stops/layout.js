'use client';

import { styled } from '@stitches/react';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';
import API from '../../../../services/API';
import { TwoUnevenColumns } from '../../../../components/Layouts/Layouts';
import Pannel from '../../../../components/Pannel/Pannel';
import ListItem from './listItem';
import { TextInput, ActionIcon, Menu, Divider } from '@mantine/core';
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
      const response = await API({
        service: 'stops',
        operation: 'create',
        method: 'GET',
      });
      router.push(`/dashboard/stops/${response._id}`);
      notify('new', 'success', 'Paragem criada com sucesso.');
      setIsCreating(false);
    } catch (err) {
      setIsCreating(false);
      console.log(err);
      notify('new', 'error', err.message);
    }
  };

  const listData = useMemo(() => {
    return stopsData || [];
  }, [stopsData]);

  //
  // D. Render data

  return (
    <AuthGate permission='stops_view' redirect>
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
                    <Menu.Item icon={<IconCirclePlus size='20px' />} onClick={handleCreateStop}>
                      {t('operations.create.title')}
                    </Menu.Item>
                    <Menu.Label>Exportar</Menu.Label>
                    <Menu.Item icon={<IconArrowBarToDown size='20px' />}>Download stop.txt</Menu.Item>
                    <Menu.Label>Dados Relacionados</Menu.Label>
                    <Menu.Item icon={<IconPencil size='20px' />} onClick={() => router.push('/dashboard/municipalities')}>
                      Editar Municípios
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </>
            }
            footer={listData && <ListFooter>{t('list.footer', { count: listData.length })}</ListFooter>}
          >
            <ErrorDisplay error={stopsError} loading={stopsValidating} />
            {listData && listData.length > 0 ? (
              <AutoSizer>
                {({ height, width }) => (
                  <List className='List' height={height} itemCount={listData.length} itemSize={85} width={width}>
                    {({ index, style }) => (
                      <ListItem key={listData[index]._id} _id={listData[index]._id} style={style} stop_code={listData[index].stop_code} stop_name={listData[index].stop_name} stop_lat={listData[index].stop_lat} stop_lon={listData[index].stop_lon} />
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
