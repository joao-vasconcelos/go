'use client';

/* * */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useSearch from '@/hooks/useSearch';
import useSWR from 'swr';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';
import API from '@/services/API';
import { TwoUnevenColumns } from '@/components/Layouts/Layouts';
import Pannel from '@/components/Pannel/Pannel';
import ListItem from '../../app/[locale]/(dashboard)/stops/listItem';
import { ActionIcon, Menu, Text } from '@mantine/core';
import { IconCirclePlus, IconDots, IconPencil, IconRefresh } from '@tabler/icons-react';
import { openConfirmModal } from '@mantine/modals';
import notify from '@/services/notify';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import ErrorDisplay from '@/components/ErrorDisplay';
import { useTranslations } from 'next-intl';
import ListFooter from '@/components/ListFooter/ListFooter';
import AuthGate from '@/components/AuthGate/AuthGate';
import SearchField from '@/components/SearchField/SearchField';
import StopsExplorerNewStopWizard from '@/components/StopsExplorerNewStopWizard/StopsExplorerNewStopWizard';
import { useStopsExplorerNewStopWizardContext } from '@/contexts/StopsExplorerNewStopWizardContext';
import ListHeader from '../ListHeader/ListHeader';

/* * */

export default function StopsExplorerLayout({ children }) {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const t = useTranslations('stops');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isBatchUpdating, setIsBatchUpdating] = useState(false);
  const stopsExplorerNewStopWizardContext = useStopsExplorerNewStopWizardContext();

  //
  // B. Fetch data

  const { data: allStopsData, error: allStopsError, isLoading: allStopsLoading, isValidating: allStopsValidating, mutate: allStopsMutate } = useSWR('/api/stops');

  //
  // C. Search

  const filteredStopsData = useSearch(searchQuery, allStopsData, { keys: ['code', 'name', 'latitude', 'longitude'] });

  // D. Handle actions

  const handleCreate = async () => {
    stopsExplorerNewStopWizardContext.openWizard();
  };

  const handleBatchUpdate = async () => {
    openConfirmModal({
      title: <Text size="h2">{t('operations.batch_update.title')}</Text>,
      centered: true,
      closeOnClickOutside: true,
      children: <Text size="h3">{t('operations.batch_update.description')}</Text>,
      labels: { confirm: t('operations.batch_update.confirm'), cancel: t('operations.batch_update.cancel') },
      onConfirm: async () => {
        try {
          setIsBatchUpdating(true);
          notify('batch_update', 'loading', t('operations.batch_update.loading'));
          await API({ service: 'stops', operation: 'batch_update', method: 'GET' });
          notify('batch_update', 'success', t('operations.batch_update.success'));
          setIsBatchUpdating(false);
        } catch (err) {
          console.log(err);
          setIsBatchUpdating(false);
          notify('batch_update', 'error', err.message || t('operations.batch_update.error'));
        }
      },
    });
  };

  //
  // E. Render data

  return (
    <AuthGate scope="stops" permission="view" redirect>
      <TwoUnevenColumns
        first={
          <Pannel
            loading={allStopsLoading || isCreating || isBatchUpdating}
            header={
              <ListHeader>
                <SearchField query={searchQuery} onChange={setSearchQuery} />
                <Menu shadow="md" position="bottom-end">
                  <Menu.Target>
                    <ActionIcon variant="light" size="lg" color="gray" loading={allStopsLoading || isCreating}>
                      <IconDots size={20} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <AuthGate scope="stops" permission="create_edit">
                      <Menu.Item leftSection={<IconCirclePlus size={20} />} onClick={handleCreate}>
                        {t('operations.create.title')}
                      </Menu.Item>
                    </AuthGate>
                    <Menu.Divider />
                    <AuthGate scope="configs" permission="admin">
                      <Menu.Item leftSection={<IconRefresh size={20} />} onClick={handleBatchUpdate}>
                        {t('operations.batch_update.title')}
                      </Menu.Item>
                    </AuthGate>
                    <Menu.Divider />
                    <AuthGate scope="municipalities" permission="view">
                      <Menu.Item leftSection={<IconPencil size={20} />} onClick={() => router.push('/dashboard/municipalities')}>
                        Editar Municípios
                      </Menu.Item>
                    </AuthGate>
                  </Menu.Dropdown>
                </Menu>
              </ListHeader>
            }
            footer={filteredStopsData && <ListFooter>{t('list.footer', { count: filteredStopsData.length })}</ListFooter>}
          >
            <StopsExplorerNewStopWizard />
            <ErrorDisplay error={allStopsError} loading={allStopsValidating} />
            {filteredStopsData && filteredStopsData.length > 0 ? (
              <AutoSizer>
                {({ height, width }) => (
                  <List className="List" height={height} itemCount={filteredStopsData.length} itemSize={85} width={width}>
                    {({ index, style }) => (
                      <ListItem key={filteredStopsData[index]._id} style={style} _id={filteredStopsData[index]._id} code={filteredStopsData[index].code} name={filteredStopsData[index].name} latitude={filteredStopsData[index].latitude} longitude={filteredStopsData[index].longitude} />
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

  //
}
