'use client';

import { styled } from '@stitches/react';
import { useRouter } from 'next/navigation';
import BaseListItem from '../../../layouts/BaseListItem';
import Flex from '../../../layouts/Flex';

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

export default function ListItem({ _id, fare_id, fare_short_name, fare_long_name, price, currency_type }) {
  //

  const router = useRouter();

  const handleClick = () => {
    router.push(`/dashboard/fares/${_id}`);
  };

  return (
    <BaseListItem onClick={handleClick} withChevron>
      <Wrapper>
        <Title isUntitled={!fare_long_name}>{fare_long_name || 'Tarifário Sem Nome'}</Title>
        <Flex>
          <Badge>{fare_id}</Badge>
          <Badge>{fare_short_name}</Badge>
          <Badge>{`${price} ${currency_type}`}</Badge>
        </Flex>
      </Wrapper>
    </BaseListItem>
  );
}
