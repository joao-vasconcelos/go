'use client';

import { styled } from '@stitches/react';

const Text = styled('div', {
  display: 'flex',
  alignItems: 'center',
  //   justifyContent: 'center',
  width: '100%',
  height: '100%',
  fontSize: '22px',
  fontWeight: '$medium',
  color: '$gray12',
});

export default function HeaderTitle({ text }) {
  return <Text>{text}</Text>;
}
