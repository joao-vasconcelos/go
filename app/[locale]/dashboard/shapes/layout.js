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
import { IconCirclePlus, IconArrowBarToDown, IconDots } from '@tabler/icons-react';
import notify from '../../../../services/notify';
import NoDataLabel from '../../../../components/NoDataLabel';
import ErrorDisplay from '../../../../components/ErrorDisplay';
import { useTranslations } from 'next-intl';
import ListFooter from '../../../../components/ListFooter/ListFooter';

const SearchField = styled(TextInput, {
  width: '100%',
});

export default function Layout({ children }) {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const t = useTranslations('shapes');

  const [isCreating, setIsCreating] = useState(false);

  //
  // B. Fetch data

  const { data: shapesData, error: shapesError, isLoading: shapesLoading, isValidating: shapesValidating } = useSWR('/api/shapes');

  //
  // C. Handle actions

  const handleCreateShape = async () => {
    try {
      setIsCreating(true);
      notify('new', 'loading', t('operations.create.loading'));
      const response = await API({ service: 'shapes', operation: 'create', method: 'GET' });
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
    <TwoUnevenColumns
      first={
        <Pannel
          loading={shapesLoading}
          header={
            <>
              <SearchField placeholder='Procurar...' width={'100%'} />
              <Menu shadow='md' position='bottom-end'>
                <Menu.Target>
                  <ActionIcon variant='light' size='lg' loading={shapesLoading || isCreating}>
                    <IconDots size='20px' />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Importar</Menu.Label>
                  <Menu.Item icon={<IconCirclePlus size='20px' />} onClick={handleCreateShape}>
                    {t('operations.create.title')}
                  </Menu.Item>
                  <Menu.Label>Exportar</Menu.Label>
                  <Menu.Item icon={<IconArrowBarToDown size='20px' />}>Download shapes.txt</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </>
          }
          footer={shapesData && <ListFooter>{t('list.footer', { count: shapesData.length })}</ListFooter>}
        >
          <ErrorDisplay error={shapesError} loading={shapesValidating} />
          {shapesData && shapesData.length > 0 ? shapesData.map((item) => <ListItem key={item._id} _id={item._id} shape_code={item.shape_code} shape_name={item.shape_name} shape_distance={item.shape_distance} />) : <NoDataLabel />}
        </Pannel>
      }
      second={children}
    />
  );
}
