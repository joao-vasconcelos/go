'use client';

import { styled } from '@stitches/react';
import TwoUnevenColumns from '../../../layouts/TwoUnevenColumns';
import Pannel from '../../../layouts/Pannel';
import ListItem from './listItem';
import { TextInput, ActionIcon, Tooltip } from '@mantine/core';
import { TbCirclePlus } from 'react-icons/tb';

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
              <Tooltip label='Criar Linha' color='blue' withArrow>
                <ActionIcon variant='light' size='lg'>
                  <TbCirclePlus size='20px' />
                </ActionIcon>
              </Tooltip>
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
