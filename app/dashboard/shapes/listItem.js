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

export default function ListItem({ shape_id, shape_name, shape_distance }) {
  return (
    <BaseListItem withChevron>
      <Wrapper>
        <Title>{shape_name}</Title>
        <Flex gap='xs'>
          <Badge>{shape_id}</Badge>
          <Badge>{shape_distance} km</Badge>
        </Flex>
      </Wrapper>
    </BaseListItem>
  );
}
