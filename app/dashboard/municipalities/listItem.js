'use client';

import { styled } from '@stitches/react';
import { useRouter, useParams } from 'next/navigation';
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

export default function ListItem({ _id, municipality_code, municipality_name, district, dico }) {
  //

  const router = useRouter();
  const { municipality_id } = useParams();

  const handleClick = () => {
    router.push(`/dashboard/municipalities/${_id}`);
  };

  return (
    <BaseListItem onClick={handleClick} isSelected={municipality_id === _id} withChevron>
      <Wrapper>
        <Title isUntitled={!municipality_name}>{municipality_name || 'Município Sem Nome'}</Title>
        <Flex>
          <Badge>{municipality_code}</Badge>
          <Badge>{district}</Badge>
          <Badge>{dico}</Badge>
        </Flex>
      </Wrapper>
    </BaseListItem>
  );
}
