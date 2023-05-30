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
  const t = useTranslations('municipalities');

  const [isCreating, setIsCreating] = useState(false);

  //
  // B. Fetch data

  const { data: municipalitiesData, error: municipalitiesError, isLoading: municipalitiesLoading, isValidating: municipalitiesValidating } = useSWR('/api/municipalities');

  //
  // C. Handle actions

  const handleCreate = async () => {
    try {
      setIsCreating(true);
      notify('new', 'loading', t('operations.create.loading'));
      const response = await API({ service: 'municipalities', operation: 'create', method: 'GET' });
      router.push(`/dashboard/municipalities/${response._id}`);
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
    <AuthGate scope='municipalities' permission='view' redirect>
      <TwoUnevenColumns
        first={
          <Pannel
            loading={municipalitiesLoading}
            header={
              <>
                <SearchField placeholder='Procurar...' width={'100%'} />
                <Menu shadow='md' position='bottom-end'>
                  <Menu.Target>
                    <ActionIcon variant='light' size='lg' loading={municipalitiesLoading || isCreating}>
                      <IconDots size='20px' />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <AuthGate scope='municipalities' permission='create_edit'>
                      <Menu.Label>Importar</Menu.Label>
                      <Menu.Item icon={<IconCirclePlus size='20px' />} onClick={handleCreate}>
                        {t('operations.create.title')}
                      </Menu.Item>
                    </AuthGate>
                  </Menu.Dropdown>
                </Menu>
              </>
            }
            footer={municipalitiesData && <ListFooter>{t('list.footer', { count: municipalitiesData.length })}</ListFooter>}
          >
            <ErrorDisplay error={municipalitiesError} loading={municipalitiesValidating} />
            {municipalitiesData && municipalitiesData.length > 0 ? municipalitiesData.map((item) => <ListItem key={item._id} _id={item._id} code={item.code} name={item.name} district={item.district} dico={item.dico} />) : <NoDataLabel />}
          </Pannel>
        }
        second={children}
      />
    </AuthGate>
  );
}
