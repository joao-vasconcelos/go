'use client';

import useSWR from 'swr';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  const t = useTranslations('lines');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  //
  // B. Fetch data

  const { data: allLinesData, error: allLinesError, isLoading: allLinesLoading, isValidating: allLinesValidating, mutate: allLinesMutate } = useSWR('/api/lines');

  //
  // C. Search

  const filteredLinesData = useSearch(searchQuery, allLinesData, { keys: ['code', 'short_name', 'name'] });

  //
  // C. Handle actions

  const handleCreate = async () => {
    try {
      setIsCreating(true);
      notify('new', 'loading', t('operations.create.loading'));
      const response = await API({ service: 'lines', operation: 'create', method: 'GET' });
      allLinesMutate();
      router.push(`/dashboard/lines/${response._id}`);
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
    <AuthGate scope="lines" permission="view" redirect>
      <TwoUnevenColumns
        first={
          <Pannel
            loading={allLinesLoading}
            header={
              <>
                <SearchField query={searchQuery} onChange={setSearchQuery} />
                <Menu shadow="md" position="bottom-end">
                  <Menu.Target>
                    <ActionIcon variant="light" size="lg" color="gray" loading={allLinesLoading || isCreating}>
                      <IconDots size={20} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <AuthGate scope="lines" permission="create_edit">
                      <Menu.Item leftSection={<IconCirclePlus size={20} />} onClick={handleCreate}>
                        {t('operations.create.title')}
                      </Menu.Item>
                    </AuthGate>
                    <MenuDivider />
                    <AuthGate scope="agencies" permission="view">
                      <Menu.Item leftSection={<IconPencil size={20} />} onClick={() => router.push('/dashboard/agencies')}>
                        Edit Agencies
                      </Menu.Item>
                    </AuthGate>
                    <AuthGate scope="typologies" permission="view">
                      <Menu.Item leftSection={<IconPencil size={20} />} onClick={() => router.push('/dashboard/typologies')}>
                        Edit Typologies
                      </Menu.Item>
                    </AuthGate>
                    <AuthGate scope="zones" permission="view">
                      <Menu.Item leftSection={<IconPencil size={20} />} onClick={() => router.push('/dashboard/zones')}>
                        Edit Zones
                      </Menu.Item>
                    </AuthGate>
                    <AuthGate scope="fares" permission="view">
                      <Menu.Item leftSection={<IconPencil size={20} />} onClick={() => router.push('/dashboard/fares')}>
                        Edit Fares
                      </Menu.Item>
                    </AuthGate>
                    <AuthGate scope="municipalities" permission="view">
                      <Menu.Item leftSection={<IconPencil size={20} />} onClick={() => router.push('/dashboard/municipalities')}>
                        Edit Municipalities
                      </Menu.Item>
                    </AuthGate>
                  </Menu.Dropdown>
                </Menu>
              </>
            }
            footer={filteredLinesData && <ListFooter>{t('list.footer', { count: filteredLinesData.length })}</ListFooter>}
          >
            <ErrorDisplay error={allLinesError} loading={allLinesValidating} />
            {filteredLinesData && filteredLinesData.length > 0 ? (
              filteredLinesData.map((item) => <ListItem key={item._id} _id={item._id} short_name={item.short_name} name={item.name} color={item.typology?.color} text_color={item.typology?.text_color} />)
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
