'use client';

import { styled } from '@stitches/react';

const Text = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  fontSize: '20px',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  color: 'rgba(0,0,0,0.05)',
  letterSpacing: '1px',
});

export default function Page() {
  return <Text>Nenhum Tarifário Selecionado</Text>;
}
