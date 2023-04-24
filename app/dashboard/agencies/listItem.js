'use client';

import { styled } from '@stitches/react';
import BaseListItem from '../../../layouts/BaseListItem';

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

export default function ListItem({ agency_id, agency_name }) {
  return (
    <BaseListItem withChevron>
      <Wrapper>
        <Title>{agency_name}</Title>
        <Badge>{agency_id}</Badge>
      </Wrapper>
    </BaseListItem>
  );
}
