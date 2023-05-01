'use client';

import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { styled } from '@stitches/react';
import API from '../../../../services/API';
import { Draggable } from '@hello-pangea/dnd';
import { TbChevronUp, TbChevronDown, TbChevronRight, TbAlertTriangleFilled } from 'react-icons/tb';
import { Skeleton, Loader } from '@mantine/core';

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

export default function RouteCard({ line_code, route_id, index, onOpen, route_code, route_name }) {
  //

  //
  // A. Setup variables

  //
  // B. Fetch data

  const { data: routeData, error: routeError, isLoading: routeLoading, isValidating: routeValidating, mutate: routeMutate } = useSWR(route_id && `/api/routes/${route_id}`);

  //
  // E. Render components

  const whenLoading = (
    <Draggable draggableId={index.toString()} index={index}>
      {(provided) => (
        <Container ref={provided.innerRef} {...provided.draggableProps}>
          <Toolbar {...provided.dragHandleProps}>
            <TbChevronUp size='20px' />
            <TbChevronDown size='20px' />
          </Toolbar>
          <Wrapper>
            <Skeleton height={20} width='30%' radius='sm' />
            <Skeleton height={25} width='100%' radius='sm' />
          </Wrapper>
        </Container>
      )}
    </Draggable>
  );

  const whenError = (
    <Container>
      <Toolbar>
        <TbAlertTriangleFilled size='20px' />
      </Toolbar>
      <Wrapper>
        <Title>Ocorreu um erro</Title>
        <Subtitle>{routeError && routeError.message ? routeError.message : 'Não foi possível carregar esta rota.'}</Subtitle>
      </Wrapper>
    </Container>
  );

  const whenLoaded = (
    <Draggable draggableId={index.toString()} index={index}>
      {(provided) => (
        <Container ref={provided.innerRef} {...provided.draggableProps} clickable>
          <Toolbar {...provided.dragHandleProps}>
            <TbChevronUp size='20px' />
            <TbChevronDown size='20px' />
          </Toolbar>
          <Wrapper onClick={() => onOpen(index)}>
            <Subtitle>
              {line_code}_{index}
            </Subtitle>
            <Title isUntitled={!routeData.route_name}>{routeData.route_name ? routeData.route_name : 'Rota Sem Nome'}</Title>
          </Wrapper>
          <Toolbar>
            <TbChevronRight size='20px' />
          </Toolbar>
        </Container>
      )}
    </Draggable>
  );

  if (routeLoading) return whenLoading;
  else if (routeError) return whenError;
  else if (routeData) return whenLoaded;

  //
}
