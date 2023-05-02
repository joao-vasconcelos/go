'use client';

import { styled } from '@stitches/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import API from '../../../services/API';
import TwoUnevenColumns from '../../../layouts/TwoUnevenColumns';
import Pannel from '../../../layouts/Pannel';
import ListItem from './listItem';
import { TextInput, ActionIcon, Menu } from '@mantine/core';
import { TbCirclePlus, TbArrowBarToDown, TbDots } from 'react-icons/tb';
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

  const { data: shapesData, error: shapesError, isLoading: shapesLoading, isValidating: shapesValidating } = useSWR('/api/shapes');

  //
  // C. Handle actions

  const handleCreateShape = async () => {
    try {
      setIsCreating(true);
      const response = await API({
        service: 'shapes',
        operation: 'create',
        method: 'GET',
      });
      router.push(`/dashboard/shapes/${response._id}`);
      notify('new', 'success', 'Shape criada com sucesso.');
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
          loading={shapesLoading}
          header={
            <>
              <SearchField placeholder='Procurar...' width={'100%'} />
              <Menu shadow='md' position='bottom-end'>
                <Menu.Target>
                  <ActionIcon variant='light' size='lg' loading={shapesLoading || isCreating}>
                    <TbDots size='20px' />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Importar</Menu.Label>
                  <Menu.Item icon={<TbCirclePlus size='20px' />} onClick={handleCreateShape}>
                    Nova Shape
                  </Menu.Item>
                  <Menu.Label>Exportar</Menu.Label>
                  <Menu.Item icon={<TbArrowBarToDown size='20px' />}>Download shapes.txt</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </>
          }
          footer={shapesData && (shapesData.length === 1 ? <FooterText text={`Encontrada 1 Shape`} /> : <FooterText text={`Encontradas ${shapesData.length} Shapes`} />)}
        >
          <ErrorDisplay error={shapesError} loading={shapesValidating} />
          {shapesData && shapesData.length > 0 ? shapesData.map((item) => <ListItem key={item._id} _id={item._id} shape_code={item.shape_code} shape_name={item.shape_name} shape_distance={item.shape_distance} />) : <NoDataLabel />}
        </Pannel>
      }
      second={children}
    />
  );
}
