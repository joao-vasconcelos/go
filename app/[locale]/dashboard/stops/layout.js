'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useSearch from '../../../../hooks/useSearch';
import useSWR from 'swr';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';
import API from '../../../../services/API';
import { TwoUnevenColumns } from '../../../../components/Layouts/Layouts';
import Pannel from '../../../../components/Pannel/Pannel';
import ListItem from './listItem';
import { ActionIcon, Menu } from '@mantine/core';
import { IconCirclePlus, IconDots, IconPencil } from '@tabler/icons-react';
import notify from '../../../../services/notify';
import NoDataLabel from '../../../../components/NoDataLabel';
import ErrorDisplay from '../../../../components/ErrorDisplay';
import { useTranslations } from 'next-intl';
import ListFooter from '../../../../components/ListFooter/ListFooter';
import AuthGate from '../../../../components/AuthGate/AuthGate';
import SearchField from '../../../../components/SearchField/SearchField';

export default function Layout({ children }) {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const t = useTranslations('stops');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  //
  // B. Fetch data

  const { data: allStopsData, error: allStopsError, isLoading: allStopsLoading, isValidating: allStopsValidating, mutate: allStopsMutate } = useSWR('/api/stops');

  //
  // C. Search

  const filteredStopsData = useSearch(searchQuery, allStopsData, { keys: ['code', 'name', 'latitude', 'longitude'] });

  //
  // C. Handle actions

  const handleCreate = async () => {
    try {
      setIsCreating(true);
      notify('new', 'loading', t('operations.create.loading'));
      const response = await API({ service: 'stops', operation: 'create', method: 'GET' });
      allStopsMutate();
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
            loading={allStopsLoading || isCreating}
            header={
              <>
                <SearchField query={searchQuery} onChange={setSearchQuery} />
                <Menu shadow='md' position='bottom-end'>
                  <Menu.Target>
                    <ActionIcon variant='light' size='lg' loading={allStopsLoading || isCreating}>
                      <IconDots size='20px' />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Label>Importar</Menu.Label>
                    <AuthGate scope='stops' permission='create_edit'>
                      <Menu.Item icon={<IconCirclePlus size='20px' />} onClick={handleCreate}>
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
            footer={filteredStopsData && <ListFooter>{t('list.footer', { count: filteredStopsData.length })}</ListFooter>}
          >
            <ErrorDisplay error={allStopsError} loading={allStopsValidating} />
            {filteredStopsData && filteredStopsData.length > 0 ? (
              <AutoSizer>
                {({ height, width }) => (
                  <List className='List' height={height} itemCount={filteredStopsData.length} itemSize={85} width={width}>
                    {({ index, style }) => (
                      <ListItem
                        key={filteredStopsData[index]._id}
                        style={style}
                        _id={filteredStopsData[index]._id}
                        code={filteredStopsData[index].code}
                        name={filteredStopsData[index].name}
                        latitude={filteredStopsData[index].latitude}
                        longitude={filteredStopsData[index].longitude}
                      />
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
