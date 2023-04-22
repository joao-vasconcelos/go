'use client';

import { styled } from '@stitches/react';
import { TextInput, ActionIcon } from '@mantine/core';
import { TbCirclePlus } from 'react-icons/tb';

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: '100%',
  backgroundColor: '#ffffff',
  border: '1px solid rgba(0,0,0,0.1)',
  borderRadius: '3px',
  boxShadow: 'md',
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

export default function ScrollList({}) {
  //

  return (
    <Container>
      <Header>
        <SearchField placeholder='Procurar Linha' width={'100%'} />
        <ActionIcon variant='light' size='lg'>
          <TbCirclePlus size='20px' />
        </ActionIcon>
      </Header>
      dklfmdom
    </Container>
  );
}
