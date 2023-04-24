'use client';

import { styled } from '@stitches/react';
import TwoUnevenColumns from '../../../layouts/TwoUnevenColumns';
import Pannel from '../../../layouts/Pannel';
import ListItem from './listItem';
import { TextInput, ActionIcon, Menu } from '@mantine/core';
import { TbCirclePlus, TbArrowBarToDown, TbDots } from 'react-icons/tb';

const SearchField = styled(TextInput, {
  width: '100%',
});

export default function Layout({ children }) {
  //

  const fares = [
    { fare_id: 'INTER-REGIONAL-A', fare_name: 'Inter-regional (A)', fare_price: 4.5 },
    { fare_id: 'INTER-REGIONAL-B', fare_name: 'Inter-regional (B)', fare_price: 2.1 },
    { fare_id: 'LONGA', fare_name: 'Linha Longa', fare_price: 1.8 },
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
                  <Menu.Item icon={<TbCirclePlus size='20px' />}>Novo Tarifário</Menu.Item>
                  <Menu.Label>Exportar</Menu.Label>
                  <Menu.Item icon={<TbArrowBarToDown size='20px' />}>Download fare_attributes.txt</Menu.Item>
                  <Menu.Item icon={<TbArrowBarToDown size='20px' />}>Download fare_rules.txt</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </>
          }
        >
          {fares.map((item) => (
            <ListItem key={item.fare_id} fare_id={item.fare_id} fare_name={item.fare_name} fare_price={item.fare_price} />
          ))}
        </Pannel>
      }
      second={children}
    />
  );
}
