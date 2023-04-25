'use client';

import { styled } from '@stitches/react';

const Text = styled('div', {
  margin: 'auto',
  fontSize: '20px',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  color: 'rgba(0,0,0,0.05)',
  letterSpacing: '1px',
  variants: {
    fill: {
      true: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        margin: 0,
      },
    },
  },
});

export default function NoDataLabel({ fill, text = 'Sem Dados Disponíveis' }) {
  return <Text fill={fill}>{text}</Text>;
}
