'use client';

import { styled } from '@stitches/react';
import { TbChevronRight } from 'react-icons/tb';

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '$md',
  width: '100%',
  backgroundColor: '$gray0',
  borderBottom: '1px solid $gray4',
  padding: '$md',
  cursor: 'pointer',
  '&:last-child': {
    borderBottom: 'none',
  },
  '&:hover': {
    backgroundColor: '$gray2',
  },
  '&:active': {
    backgroundColor: '$gray3',
  },
  variants: {
    selected: {
      true: {
        backgroundColor: '$gray3',
      },
    },
  },
});

const Wrapper = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',
});

export default function BaseListItem({ children, withChevron }) {
  return (
    <Container>
      <Wrapper>{children}</Wrapper>
      {withChevron && <TbChevronRight size={'20px'} opacity={0.25} />}
    </Container>
  );
}
