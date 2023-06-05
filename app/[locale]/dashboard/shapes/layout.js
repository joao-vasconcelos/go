'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import API from '../../../../services/API';
import { TwoUnevenColumns } from '../../../../components/Layouts/Layouts';
import Pannel from '../../../../components/Pannel/Pannel';
import ListItem from './listItem';
import { ActionIcon, Menu } from '@mantine/core';
import { IconCirclePlus, IconDots } from '@tabler/icons-react';
import notify from '../../../../services/notify';
import NoDataLabel from '../../../../components/NoDataLabel';
import ErrorDisplay from '../../../../components/ErrorDisplay';
import { useTranslations } from 'next-intl';
import ListFooter from '../../../../components/ListFooter/ListFooter';
import AuthGate from '../../../../components/AuthGate/AuthGate';
import SearchField from '../../../../components/SearchField/SearchField';
import useSearch from '../../../../hooks/useSearch';

export default function Layout({ children }) {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const t = useTranslations('shapes');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  //
  // B. Fetch data

  const { data: allShapesData, error: allShapesError, isLoading: allShapesLoading, isValidating: allShapesValidating, mutate: allShapesMutate } = useSWR('/api/shapes');

  //
  // C. Search

  const filteredShapesData = useSearch(searchQuery, allShapesData, { keys: ['code', 'name'] });

  //
  // C. Handle actions

  const handleCreate = async () => {
    try {
      setIsCreating(true);
      notify('new', 'loading', t('operations.create.loading'));
      const response = await API({ service: 'shapes', operation: 'create', method: 'GET' });
      allShapesMutate();
      router.push(`/dashboard/shapes/${response._id}`);
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
    <AuthGate scope='shapes' permission='view' redirect>
      <TwoUnevenColumns
        first={
          <Pannel
            loading={allShapesLoading}
            header={
              <>
                <SearchField query={searchQuery} onChange={setSearchQuery} />
                <Menu shadow='md' position='bottom-end'>
                  <Menu.Target>
                    <ActionIcon variant='light' size='lg' loading={allShapesLoading || isCreating}>
                      <IconDots size='20px' />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <AuthGate scope='shapes' permission='create_edit'>
                      <Menu.Label>Importar</Menu.Label>
                      <Menu.Item icon={<IconCirclePlus size='20px' />} onClick={handleCreate}>
                        {t('operations.create.title')}
                      </Menu.Item>
                    </AuthGate>
                  </Menu.Dropdown>
                </Menu>
              </>
            }
            footer={filteredShapesData && <ListFooter>{t('list.footer', { count: filteredShapesData.length })}</ListFooter>}
          >
            <ErrorDisplay error={allShapesError} loading={allShapesValidating} />
            {filteredShapesData && filteredShapesData.length > 0 ? filteredShapesData.map((item) => <ListItem key={item._id} _id={item._id} code={item.code} name={item.name} distance={item.distance} />) : <NoDataLabel />}
          </Pannel>
        }
        second={children}
      />
    </AuthGate>
  );
}
