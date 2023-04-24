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

  const agencies = [
    { agency_id: '41', agency_name: 'Viação Alvorada' },
    { agency_id: '42', agency_name: 'Rodoviária de Lisboa' },
    { agency_id: '43', agency_name: 'TST' },
    { agency_id: '44', agency_name: 'Alsa Todi' },
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
                  <Menu.Item icon={<TbCirclePlus size='20px' />}>Nova Agência</Menu.Item>
                  <Menu.Label>Exportar</Menu.Label>
                  <Menu.Item icon={<TbArrowBarToDown size='20px' />}>Download agency.txt</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </>
          }
        >
          {agencies.map((item) => (
            <ListItem key={item.agency_id} agency_id={item.agency_id} agency_name={item.agency_name} />
          ))}
        </Pannel>
      }
      second={children}
    />
  );
}
