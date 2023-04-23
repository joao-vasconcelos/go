'use client';

import { styled } from '@stitches/react';
import { TextInput, ActionIcon } from '@mantine/core';
import { TbCirclePlus } from 'react-icons/tb';
import LineListItem from '../../app/dashboard/lines/lineListItem';

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  backgroundColor: '#ffffff',
  border: '1px solid $gray4',
  borderRadius: '$md',
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  overflow: 'auto',
});

const Header = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '$sm',
  padding: '$sm',
  width: '100%',
  borderBottom: '1px solid rgba(0,0,0,0.1)',
});

const SearchField = styled(TextInput, {
  width: '100%',
});

const Body = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr',
  width: '100%',
  overflow: 'scroll',
  background: '$gray4',
  gap: '1px',
  //   padding: '$md',
});

export default function ScrollList({}) {
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
    <Container>
      <Header>
        <SearchField placeholder='Procurar Linha' width={'100%'} />
        <ActionIcon variant='light' size='lg'>
          <TbCirclePlus size='20px' />
        </ActionIcon>
      </Header>
      <Body>
        {lines.map((item) => (
          <LineListItem key={item.short_name} short_name={item.short_name} long_name={item.long_name} />
        ))}
      </Body>
    </Container>
  );
}
