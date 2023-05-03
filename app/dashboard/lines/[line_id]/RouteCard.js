'use client';

import { styled } from '@stitches/react';
import { Draggable } from '@hello-pangea/dnd';
import { TbChevronUp, TbChevronDown, TbChevronRight } from 'react-icons/tb';

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  marginBottom: '$md',
  overflow: 'hidden',
  borderRadius: '$md',
  border: '1px solid $gray4',
  backgroundColor: '$gray0',
  variants: {
    clickable: {
      true: {
        transition: 'box-shadow 300ms ease, background-color 300ms ease',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: '$xs',
          backgroundColor: '$gray0',
        },
        '&:active': {
          backgroundColor: '$gray1',
        },
      },
    },
  },
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
  fontWeight: '$medium',
  lineHeight: '1',
});

export default function RouteCard({ index, onOpen, line_code, route_id, route_name }) {
  //

  //
  // E. Render components

  return (
    <Draggable draggableId={index.toString()} index={index}>
      {(provided) => (
        <Container ref={provided.innerRef} {...provided.draggableProps} clickable>
          <Toolbar {...provided.dragHandleProps}>
            <TbChevronUp size='20px' />
            <TbChevronDown size='20px' />
          </Toolbar>
          <Wrapper onClick={() => onOpen(route_id)}>
            <Subtitle>
              {line_code}_{index}
            </Subtitle>
            <Title isUntitled={!route_name}>{route_name ? route_name : 'Rota Sem Nome'}</Title>
          </Wrapper>
          <Toolbar>
            <TbChevronRight size='20px' />
          </Toolbar>
        </Container>
      )}
    </Draggable>
  );

  //
}
