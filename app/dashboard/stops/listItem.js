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

export default function ListItem({ _id, stop_id, stop_name, stop_lat, stop_lon }) {
  //

  const router = useRouter();

  const handleClick = () => {
    router.push(`/dashboard/stops/${_id}`);
  };

  return (
    <BaseListItem onClick={handleClick} withChevron>
      <Wrapper>
        <Title isUntitled={!stop_name}>{stop_name || 'Paragem Sem Nome'}</Title>
        <Flex>
          <Badge>{stop_id || '-'}</Badge>
          <Badge>
            {stop_lat}, {stop_lon}
          </Badge>
        </Flex>
      </Wrapper>
    </BaseListItem>
  );
}
