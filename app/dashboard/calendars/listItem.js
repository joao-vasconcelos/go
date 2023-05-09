'use client';

import { styled } from '@stitches/react';
import { useRouter, useParams } from 'next/navigation';
import BaseListItem from '../../../layouts/BaseListItem';
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

export default function ListItem({ _id, code, name }) {
  //

  const router = useRouter();
  const { calendar_id } = useParams();

  const handleClick = () => {
    router.push(`/dashboard/calendars/${_id}`);
  };

  return (
    <BaseListItem onClick={handleClick} isSelected={calendar_id === _id} withChevron>
      <Wrapper>
        <Title isUntitled={!name}>{name || 'Calendário Sem Nome'}</Title>
        <Group>
          <Badge>{code}</Badge>
        </Group>
      </Wrapper>
    </BaseListItem>
  );
}
