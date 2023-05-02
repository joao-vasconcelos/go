'use client';

import { styled } from '@stitches/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import API from '../../../services/API';
import TwoUnevenColumns from '../../../layouts/TwoUnevenColumns';
import Pannel from '../../../layouts/Pannel';
import ListItem from './listItem';
import { TextInput, ActionIcon, Menu, Divider } from '@mantine/core';
import { TbCirclePlus, TbArrowBarToDown, TbDots, TbPencil } from 'react-icons/tb';
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

  //
  // D. Render data

  return (
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
                    <TbDots size='20px' />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Importar</Menu.Label>
                  <Menu.Item icon={<TbCirclePlus size='20px' />} onClick={handleCreateStop}>
                    Nova Paragem
                  </Menu.Item>
                  <Menu.Label>Exportar</Menu.Label>
                  <Menu.Item icon={<TbArrowBarToDown size='20px' />}>Download stop.txt</Menu.Item>
                  <Menu.Label>Dados Relacionados</Menu.Label>
                  <Menu.Item icon={<TbPencil size='20px' />} onClick={() => router.push('/dashboard/municipalities')}>
                    Editar Municípios
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </>
          }
          footer={stopsData && (stopsData.length === 1 ? <FooterText text={`Encontrada 1 Paragem`} /> : <FooterText text={`Encontradas ${stopsData.length} Paragems`} />)}
        >
          <ErrorDisplay error={stopsError} loading={stopsValidating} />
          {stopsData && stopsData.length > 0 ? stopsData.map((item) => <ListItem key={item._id} _id={item._id} stop_code={item.stop_code} stop_name={item.stop_name} />) : <NoDataLabel />}
        </Pannel>
      }
      second={children}
    />
  );
}
