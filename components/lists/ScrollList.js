'use client';

import { styled } from '@stitches/react';
import { TextInput, ActionIcon } from '@mantine/core';
import { TbCirclePlus } from 'react-icons/tb';

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
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  overflow: 'scroll',
  background: '$gray3',
  padding: '$md',
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
      <Body>
        Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas
        Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas
        Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas
        Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas
        Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas
        Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas
        Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas
        Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas Lista de linhas
        Lista de linhas Lista de linhas
      </Body>
    </Container>
  );
}
