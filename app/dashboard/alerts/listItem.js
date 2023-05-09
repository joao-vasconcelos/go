'use client';

import { styled } from '@stitches/react';
import { useRouter, useParams } from 'next/navigation';
import BaseListItem from '../../../components/BaseListItem/BaseListItem';
import { Group } from '@mantine/core';

const Wrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  gap: '$sm',
});

const Title = styled('div', {
  fontSize: '16px',
  color: '$gray12',
  fontWeight: '$bold',
  variants: {
    isUntitled: {
      true: {
        fontSize: '16px',
        color: '$gray10',
        fontWeight: '$regular',
        fontStyle: 'italic',
      },
    },
  },
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

export default function ListItem({ _id, fare_code, fare_short_name, fare_long_name, price, currency_type }) {
  //

  const router = useRouter();
  const { alert_id } = useParams();

  const handleClick = () => {
    router.push(`/dashboard/alerts/${_id}`);
  };

  return (
    <BaseListItem onClick={handleClick} isSelected={alert_id === _id} withChevron>
      <Wrapper>
        <Title isUntitled={!fare_long_name}>{fare_long_name || 'Tarifário Sem Nome'}</Title>
        <Group>
          <Badge>{fare_code}</Badge>
          <Badge>{fare_short_name}</Badge>
          <Badge>{`${price} ${currency_type}`}</Badge>
        </Group>
      </Wrapper>
    </BaseListItem>
  );
}
