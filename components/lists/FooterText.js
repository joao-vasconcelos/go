'use client';

import { styled } from '@stitches/react';

const Text = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  fontSize: '12px',
  fontWeight: '$medium',
  color: '$gray10',
});

export default function FooterText({ text }) {
  return text && <Text>{text}</Text>;
}
