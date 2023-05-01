'use client';

import { styled } from '@stitches/react';
import { Draggable } from '@hello-pangea/dnd';
import { TbArrowMoveRight, TbArrowMoveLeft, TbChevronDown, TbPencil } from 'react-icons/tb';

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  overflow: 'hidden',
  border: '1px solid $gray4',
  borderRadius: '$md',
  backgroundColor: '$gray0',
  transition: 'box-shadow 300ms ease, background-color 300ms ease',
  cursor: 'pointer',
  '&:hover': {
    boxShadow: '$xs',
    backgroundColor: '$gray0',
  },
  '&:active': {
    backgroundColor: '$gray1',
  },
});

const DirectionIcon = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '$md',
});

const Toolbar = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '$md',
  color: '$gray5',
  transition: 'color 300ms ease',
  '&:hover': {
    color: '$gray8',
  },
  '&:active': {
    color: '$gray8',
  },
});

const Wrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  width: '100%',
  gap: '$sm',
  padding: '$md',
});

const Text = styled('p', {
  lineHeight: '1',
  variants: {
    isUntitled: {
      true: {
        color: '$gray6',
        fontWeight: '$regular',
        fontStyle: 'italic',
      },
    },
  },
});

const Title = styled(Text, {
  fontSize: '18px',
  color: '$gray12',
  fontWeight: '$medium',
  lineHeight: '1',
});

const Subtitle = styled(Text, {
  fontSize: '14px',
  color: '$gray8',
  fontWeight: '$bold',
  lineHeight: '1',
});

export default function PatternCard({ direction, stop_code, stop_name }) {
  return (
    <Container>
      <DirectionIcon>{direction > 0 ? <TbArrowMoveLeft size='30px' /> : <TbArrowMoveRight size='30px' />}</DirectionIcon>
      <Wrapper>
        <Subtitle isUntitled={!stop_code}>{stop_code ? stop_code : '0000_0_0'}</Subtitle>
        <Title isUntitled={!stop_name}>{stop_name ? stop_name : 'Paragem Sem Nome'}</Title>
      </Wrapper>
      <Toolbar>
        <TbPencil size='20px' />
      </Toolbar>
    </Container>
  );
}
