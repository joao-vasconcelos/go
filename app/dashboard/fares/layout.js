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

export default function Layout({ children }) {
  //

  const fares = [
    { fare_id: 'INTER-REGIONAL-A', fare_name: 'Inter-regional (A)', price: 4.5 },
    { fare_id: 'INTER-REGIONAL-B', fare_name: 'Inter-regional (B)', price: 2.1 },
    { fare_id: 'LONGA', fare_name: 'Linha Longa', price: 1.8 },
  ];

  return (
    <TwoUnevenColumns
      first={
        <Pannel
          header={
            <>
              <SearchField placeholder='Procurar...' width={'100%'} />
              <Tooltip label='Criar Tarifário' color='blue' withArrow>
                <ActionIcon variant='light' size='lg'>
                  <TbCirclePlus size='20px' />
                </ActionIcon>
              </Tooltip>
            </>
          }
        >
          {fares.map((item) => (
            <ListItem key={item.fare_id} fare_id={item.fare_id} fare_name={item.fare_name} />
          ))}
        </Pannel>
      }
      second={children}
    />
  );
}
