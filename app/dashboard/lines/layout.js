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

  const lines = [
    { short_name: 'CP', long_name: 'Amadora (Estação Norte) via Moinhos da Funcheira | Circular evenbigger name' },
    { short_name: 1234, long_name: 'Amadora (Estação Norte) via Moinhos da Funcheira | Circular evenbigger name' },
    { short_name: 1234, long_name: 'Amadora (Estação Norte) via Moinhos da Funcheira | Circular evenbigger name' },
    { short_name: 1234, long_name: 'Amadora (Estação Norte) via Moinhos da Funcheira | Circular evenbigger name' },
    { short_name: 1234, long_name: 'Amadora (Estação Norte) via Moinhos da Funcheira | Circular evenbigger name' },
    { short_name: 1234, long_name: 'Amadora (Estação Norte) via Moinhos da Funcheira | Circular evenbigger name' },
    { short_name: 1234, long_name: 'Amadora (Estação Norte) via Moinhos da Funcheira | Circular evenbigger name' },
    { short_name: 1234, long_name: 'Amadora (Estação Norte) via Moinhos da Funcheira | Circular evenbigger name' },
    { short_name: 1234, long_name: 'Amadora (Estação Norte) via Moinhos da Funcheira | Circular evenbigger name' },
    { short_name: 1234, long_name: 'Amadora (Estação Norte) via Moinhos da Funcheira | Circular evenbigger name' },
    { short_name: 1234, long_name: 'Amadora (Estação Norte) via Moinhos da Funcheira | Circular evenbigger name' },
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
                  <Menu.Item icon={<TbCirclePlus size='20px' />}>Nova Linha</Menu.Item>
                  <Menu.Item icon={<TbArrowBarToUp size='20px' />}>Importação em Lote</Menu.Item>
                  <Menu.Label>Exportar</Menu.Label>
                  <Menu.Item icon={<TbArrowBarToDown size='20px' />}>Download routes.txt</Menu.Item>
                  <Menu.Item icon={<TbArrowBarToDown size='20px' />}>Download trips.txt</Menu.Item>
                  <Menu.Item icon={<TbArrowBarToDown size='20px' />}>Download stop_times.txt</Menu.Item>
                  <Menu.Item icon={<TbArrowBarToDown size='20px' />}>Download resources.txt</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </>
          }
        >
          {lines.map((item) => (
            <ListItem key={item.short_name} short_name={item.short_name} long_name={item.long_name} />
          ))}
        </Pannel>
      }
      second={children}
    />
  );
}
