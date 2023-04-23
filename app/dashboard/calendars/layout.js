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
              <Tooltip label='Criar Serviço' color='blue' withArrow>
                <ActionIcon variant='light' size='lg'>
                  <TbCirclePlus size='20px' />
                </ActionIcon>
              </Tooltip>
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
