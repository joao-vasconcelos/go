'use client';

import { styled } from '@stitches/react';
import BaseListItem from '../../../layouts/BaseListItem';
import { Flex } from '@mantine/core';

const Wrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  gap: '$sm',
});

const Title = styled('div', {
  fontSize: '16px',
  color: '$gray12',
  fontWeight: 'bold',
});

const Badge = styled('div', {
  fontFamily: 'monospace',
  fontSize: '10px',
  letterSpacing: '1px',
  color: '$gray9',
  border: '1px solid $gray6',
  padding: '2px 6px',
  borderRadius: '$md',
});

export default function ListItem({ stop_id, stop_name, stop_lat, stop_lon }) {
  return (
    <BaseListItem withChevron>
      <Wrapper>
        <Title>{stop_name}</Title>
        <Flex gap='xs'>
          <Badge>{stop_id}</Badge>
          <Badge>
            {stop_lat}, {stop_lon}
          </Badge>
        </Flex>
      </Wrapper>
    </BaseListItem>
  );
}
