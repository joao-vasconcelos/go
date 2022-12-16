import { styled } from '@stitches/react';
import { TextInput, Select, Group, Text } from '@mantine/core';

/* SPACER */
/* Explanation needed. */
export const Grid = styled('div', {
  display: 'grid',
  borderRadius: '$md',
  gap: '$sm',
  variants: {
    layout: {
      auto: {
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      },
      iconRight: {
        gridTemplateColumns: '1fr  minmax(100px, 5%)',
      },
    },
    valign: {
      top: {
        alignItems: 'flex-start',
      },
      center: {
        alignItems: 'center',
      },
      bottom: {
        alignItems: 'flex-end',
      },
    },
  },
  defaultVariants: {
    layout: 'auto',
    valign: 'top',
  },
});

/* SPACER */
/* Explanation needed. */
export const Spacer = styled('div', {
  variants: {
    width: {
      full: {
        flexGrow: 1,
      },
    },
  },
});

/* SPACER */
/* Explanation needed. */
export const Title = styled('p', {
  fontSize: '$xl',
  fontWeight: '$bold',
  color: '$gray12',
});

/* SPACER */
/* Explanation needed. */
export const Title2 = styled('p', {
  fontSize: '$xl',
  fontWeight: '$bold',
  color: '$gray12',
});
