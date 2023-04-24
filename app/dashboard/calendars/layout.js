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

export default function Layout({ children }) {
  //

  const services = [
    { service_id: '2232r4', service_name: 'Dias Úteis' },
    { service_id: '39820', service_name: 'Feriados' },
    { service_id: '29839', service_name: 'Primeiros Domingos do Mês' },
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
                  <Menu.Item icon={<TbCirclePlus size='20px' />}>Novo Calendário</Menu.Item>
                  <Menu.Item icon={<TbArrowBarToUp size='20px' />}>Importação em Lote</Menu.Item>
                  <Menu.Label>Exportar</Menu.Label>
                  <Menu.Item icon={<TbArrowBarToDown size='20px' />}>Download calendar_dates.txt</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </>
          }
        >
          {services.map((item) => (
            <ListItem key={item.service_id} service_id={item.service_id} service_name={item.service_name} />
          ))}
        </Pannel>
      }
      second={children}
    />
  );
}
