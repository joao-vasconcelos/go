'use client';

import { styled } from '@stitches/react';
import TwoUnevenColumns from '../../../layouts/TwoUnevenColumns';
import Pannel from '../../../layouts/Pannel';
import ListItem from './listItem';
import { TextInput, ActionIcon, Menu } from '@mantine/core';
import { TbCirclePlus, TbArrowBarToUp, TbArrowBarToDown, TbDots } from 'react-icons/tb';

const SearchField = styled(TextInput, {
  width: '100%',
});

// Fetch data

export default function Layout({ children }) {
  //

  const shapes = [
    { shape_id: 'CP', shape_name: 'Percurso 123', shape_distance: 27.02 },
    { shape_id: 1234, shape_name: 'Percurso 123', shape_distance: 27.02 },
    { shape_id: 1234, shape_name: 'Percurso 123', shape_distance: 27.02 },
    { shape_id: 1234, shape_name: 'Percurso 123', shape_distance: 27.02 },
    { shape_id: 1234, shape_name: 'Percurso 123', shape_distance: 27.02 },
    { shape_id: 1234, shape_name: 'Percurso 123', shape_distance: 27.02 },
    { shape_id: 1234, shape_name: 'Percurso 123', shape_distance: 27.02 },
    { shape_id: 1234, shape_name: 'Percurso 123', shape_distance: 27.02 },
    { shape_id: 1234, shape_name: 'Percurso 123', shape_distance: 27.02 },
    { shape_id: 1234, shape_name: 'Percurso 123', shape_distance: 27.02 },
    { shape_id: 1234, shape_name: 'Percurso 123', shape_distance: 27.02 },
  ];

  return (
    <TwoUnevenColumns
      first={
        <Pannel
          header={
            <>
              <SearchField placeholder='Procurar...' width={'100%'} />
              <Menu shadow='md' position='bottom-end'>
                <Menu.Target>
                  <ActionIcon variant='light' size='lg'>
                    <TbDots size='20px' />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Importar</Menu.Label>
                  <Menu.Item icon={<TbCirclePlus size='20px' />}>Adicionar Shape</Menu.Item>
                  <Menu.Item icon={<TbArrowBarToUp size='20px' />}>Importação em Lote</Menu.Item>
                  <Menu.Label>Exportar</Menu.Label>
                  <Menu.Item icon={<TbArrowBarToDown size='20px' />}>Download shapes.txt</Menu.Item>
                  <Menu.Item icon={<TbArrowBarToDown size='20px' />}>Download GeoJSON</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </>
          }
        >
          {shapes.map((item) => (
            <ListItem key={item.shape_id} shape_id={item.shape_id} shape_name={item.shape_name} shape_distance={item.shape_distance} />
          ))}
        </Pannel>
      }
      second={children}
    />
  );
}
