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

  const users = [
    { user_id: '123456', first_name: 'Nome', last_name: 'Apelido', email: 'email@tmlmobilidade.pt' },
    { user_id: '123456', first_name: 'Nome', last_name: 'Apelido', email: 'email@tmlmobilidade.pt' },
    { user_id: '123456', first_name: 'Nome', last_name: 'Apelido', email: 'email@tmlmobilidade.pt' },
    { user_id: '123456', first_name: 'Nome', last_name: 'Apelido', email: 'email@tmlmobilidade.pt' },
    { user_id: '123456', first_name: 'Nome', last_name: 'Apelido', email: 'email@tmlmobilidade.pt' },
    { user_id: '123456', first_name: 'Nome', last_name: 'Apelido', email: 'email@tmlmobilidade.pt' },
    { user_id: '123456', first_name: 'Nome', last_name: 'Apelido', email: 'email@tmlmobilidade.pt' },
    { user_id: '123456', first_name: 'Nome', last_name: 'Apelido', email: 'email@tmlmobilidade.pt' },
    { user_id: '123456', first_name: 'Nome', last_name: 'Apelido', email: 'email@tmlmobilidade.pt' },
    { user_id: '123456', first_name: 'Nome', last_name: 'Apelido', email: 'email@tmlmobilidade.pt' },
    { user_id: '123456', first_name: 'Nome', last_name: 'Apelido', email: 'email@tmlmobilidade.pt' },
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
                  <Menu.Item icon={<TbCirclePlus size='20px' />}>Novo Utilizador</Menu.Item>
                  <Menu.Label>Exportar</Menu.Label>
                  <Menu.Item icon={<TbArrowBarToDown size='20px' />}>Download CSV</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </>
          }
        >
          {users.map((item) => (
            <ListItem key={item.user_id} user_id={item.user_id} first_name={item.first_name} last_name={item.last_name} email={item.email} />
          ))}
        </Pannel>
      }
      second={children}
    />
  );
}
