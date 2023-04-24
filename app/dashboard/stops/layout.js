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

  const stops = [
    { stop_id: '123456', stop_name: 'Amadora (Estação Norte)', stop_lat: -9.128926, stop_lon: 38.267828 },
    { stop_id: '123456', stop_name: 'Amadora (Estação Norte)', stop_lat: -9.128926, stop_lon: 38.267828 },
    { stop_id: '123456', stop_name: 'Amadora (Estação Norte)', stop_lat: -9.128926, stop_lon: 38.267828 },
    { stop_id: '123456', stop_name: 'Amadora (Estação Norte)', stop_lat: -9.128926, stop_lon: 38.267828 },
    { stop_id: '123456', stop_name: 'Amadora (Estação Norte)', stop_lat: -9.128926, stop_lon: 38.267828 },
    { stop_id: '123456', stop_name: 'Amadora (Estação Norte)', stop_lat: -9.128926, stop_lon: 38.267828 },
    { stop_id: '123456', stop_name: 'Amadora (Estação Norte)', stop_lat: -9.128926, stop_lon: 38.267828 },
    { stop_id: '123456', stop_name: 'Amadora (Estação Norte)', stop_lat: -9.128926, stop_lon: 38.267828 },
    { stop_id: '123456', stop_name: 'Amadora (Estação Norte)', stop_lat: -9.128926, stop_lon: 38.267828 },
    { stop_id: '123456', stop_name: 'Amadora (Estação Norte)', stop_lat: -9.128926, stop_lon: 38.267828 },
    { stop_id: '123456', stop_name: 'Amadora (Estação Norte)', stop_lat: -9.128926, stop_lon: 38.267828 },
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
                  <Menu.Item icon={<TbCirclePlus size='20px' />}>Nova Paragem</Menu.Item>
                  <Menu.Item icon={<TbArrowBarToUp size='20px' />}>Importação em Lote</Menu.Item>
                  <Menu.Label>Exportar</Menu.Label>
                  <Menu.Item icon={<TbArrowBarToDown size='20px' />}>Download stops.txt</Menu.Item>
                  <Menu.Item icon={<TbArrowBarToDown size='20px' />}>Download GeoJSON</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </>
          }
        >
          {stops.map((item) => (
            <ListItem key={item.stop_id} stop_id={item.stop_id} stop_name={item.stop_name} stop_lat={item.stop_lat} stop_lon={item.stop_lon} />
          ))}
        </Pannel>
      }
      second={children}
    />
  );
}
