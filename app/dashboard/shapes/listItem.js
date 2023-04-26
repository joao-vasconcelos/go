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

export default function ListItem({ _id, shape_id, shape_name, shape_distance }) {
  //

  const router = useRouter();

  const handleClick = () => {
    router.push(`/dashboard/shapes/${_id}`);
  };

  return (
    <BaseListItem onClick={handleClick} withChevron>
      <Wrapper>
        <Title isUntitled={!shape_name}>{shape_name || 'Shape Sem Nome'}</Title>
        <Flex>
          <Badge>{shape_id || '-'}</Badge>
          <Badge>{shape_distance || '0'} km</Badge>
        </Flex>
      </Wrapper>
    </BaseListItem>
  );
}
