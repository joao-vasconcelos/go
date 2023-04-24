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

export default function ListItem({ fare_id, fare_name, fare_price }) {
  return (
    <BaseListItem withChevron>
      <Wrapper>
        <Title>{fare_name}</Title>
        <Flex gap='xs'>
          <Badge>{fare_id}</Badge>
          <Badge>{fare_price}€</Badge>
        </Flex>
      </Wrapper>
    </BaseListItem>
  );
}
