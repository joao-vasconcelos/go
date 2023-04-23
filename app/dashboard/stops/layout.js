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

  const stops = [
    { stop_id: '123456', stop_name: 'Amadora (Estação Norte)' },
    { stop_id: '123456', stop_name: 'Amadora (Estação Norte)' },
    { stop_id: '123456', stop_name: 'Amadora (Estação Norte)' },
    { stop_id: '123456', stop_name: 'Amadora (Estação Norte)' },
    { stop_id: '123456', stop_name: 'Amadora (Estação Norte)' },
    { stop_id: '123456', stop_name: 'Amadora (Estação Norte)' },
    { stop_id: '123456', stop_name: 'Amadora (Estação Norte)' },
    { stop_id: '123456', stop_name: 'Amadora (Estação Norte)' },
    { stop_id: '123456', stop_name: 'Amadora (Estação Norte)' },
    { stop_id: '123456', stop_name: 'Amadora (Estação Norte)' },
    { stop_id: '123456', stop_name: 'Amadora (Estação Norte)' },
  ];

  return (
    <TwoUnevenColumns
      first={
        <Pannel
          header={
            <>
              <SearchField placeholder='Procurar...' width={'100%'} />
              <Tooltip label='Criar Paragem' color='blue' withArrow>
                <ActionIcon variant='light' size='lg'>
                  <TbCirclePlus size='20px' />
                </ActionIcon>
              </Tooltip>
            </>
          }
        >
          {stops.map((item) => (
            <ListItem key={item.stop_id} stop_id={item.stop_id} stop_name={item.stop_name} />
          ))}
        </Pannel>
      }
      second={children}
    />
  );
}
