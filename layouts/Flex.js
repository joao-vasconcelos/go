'use client';

import { styled } from '@stitches/react';

const Container = styled('div', {
  display: 'flex',
  gap: '$md',
  variants: {
    direction: {
      row: {
        flexDirection: 'row',
      },
      column: {
        flexDirection: 'column',
      },
    },
    align: {
      start: {
        alignItems: 'start',
      },
      center: {
        alignItems: 'center',
      },
      end: {
        alignItems: 'end',
      },
    },
  },
  defaultVariants: {
    direction: 'row',
    align: 'start',
  },
});

export default function Flex({ direction, children }) {
  return <Container direction={direction}>{children}</Container>;
}
