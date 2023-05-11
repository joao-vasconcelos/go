'use client';

import { styled } from '@stitches/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import API from '../../../services/API';
import { TwoUnevenColumns } from '../../../components/Layouts/Layouts';
import Pannel from '../../../components/Pannel/Pannel';
import ListItem from './listItem';
import { TextInput, ActionIcon, Menu } from '@mantine/core';
import { IconCirclePlus, IconArrowBarToDown, IconDots } from '@tabler/icons-react';
import notify from '../../../services/notify';
import NoDataLabel from '../../../components/NoDataLabel';
import ErrorDisplay from '../../../components/ErrorDisplay';
import FooterText from '../../../components/lists/FooterText';

const SearchField = styled(TextInput, {
  width: '100%',
});

export default function Layout({ children }) {
  //

  //
  // A. Setup variables

  const router = useRouter();

  const [isCreating, setIsCreating] = useState(false);

  //
  // B. Fetch data

  const { data: municipalitiesData, error: municipalitiesError, isLoading: municipalitiesLoading, isValidating: municipalitiesValidating } = useSWR('/api/municipalities');

  //
  // C. Handle actions

  const handleCreateFare = async () => {
    try {
      setIsCreating(true);
      const response = await API({
        service: 'municipalities',
        operation: 'create',
        method: 'GET',
      });
      router.push(`/dashboard/municipalities/${response._id}`);
      notify('new', 'success', 'Município criado com sucesso.');
      setIsCreating(false);
    } catch (err) {
      setIsCreating(false);
      console.log(err);
      notify('new', 'error', err.message);
    }
  };

  //
  // D. Render data

  return (
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
                  <Menu.Label>Importar</Menu.Label>
                  <Menu.Item icon={<IconCirclePlus size='20px' />} onClick={handleCreateFare}>
                    Novo Município
                  </Menu.Item>
                  <Menu.Label>Exportar</Menu.Label>
                  <Menu.Item icon={<IconArrowBarToDown size='20px' />}>Download municipalities.txt</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </>
          }
          footer={municipalitiesData && (municipalitiesData.length === 1 ? <FooterText text={`Encontrado 1 Município`} /> : <FooterText text={`Encontrados ${municipalitiesData.length} Municípios`} />)}
        >
          <ErrorDisplay error={municipalitiesError} loading={municipalitiesValidating} />
          {municipalitiesData && municipalitiesData.length > 0 ? (
            municipalitiesData.map((item) => <ListItem key={item._id} _id={item._id} municipality_code={item.municipality_code} municipality_name={item.municipality_name} district={item.district} dico={item.dico} />)
          ) : (
            <NoDataLabel />
          )}
        </Pannel>
      }
      second={children}
    />
  );
}
