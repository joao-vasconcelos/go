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

  const shapes = [
    { shape_id: 'CP', shape_title: 'Percurso 123' },
    { shape_id: 1234, shape_title: 'Percurso 123' },
    { shape_id: 1234, shape_title: 'Percurso 123' },
    { shape_id: 1234, shape_title: 'Percurso 123' },
    { shape_id: 1234, shape_title: 'Percurso 123' },
    { shape_id: 1234, shape_title: 'Percurso 123' },
    { shape_id: 1234, shape_title: 'Percurso 123' },
    { shape_id: 1234, shape_title: 'Percurso 123' },
    { shape_id: 1234, shape_title: 'Percurso 123' },
    { shape_id: 1234, shape_title: 'Percurso 123' },
    { shape_id: 1234, shape_title: 'Percurso 123' },
  ];

  return (
    <TwoUnevenColumns
      first={
        <Pannel
          header={
            <>
              <SearchField placeholder='Procurar...' width={'100%'} />
              <Tooltip label='Criar Shape' color='blue' withArrow>
                <ActionIcon variant='light' size='lg'>
                  <TbCirclePlus size='20px' />
                </ActionIcon>
              </Tooltip>
            </>
          }
        >
          {shapes.map((item) => (
            <ListItem key={item.shape_id} shape_id={item.shape_id} shape_title={item.shape_title} />
          ))}
        </Pannel>
      }
      second={children}
    />
  );
}
