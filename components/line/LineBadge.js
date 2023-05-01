'use client';

import { styled } from '@stitches/react';

const Container = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '65px',
  maxWidth: '65px',
  minHeight: '26px',
  maxHeight: '26px',
  borderRadius: '$pill',
  color: '$gray0',
  backgroundColor: '$gray10',
  fontSize: '16px',
  fontWeight: 'bold',
  letterSpacing: '1px',
});

export default function LineBadge({ short_name, color, text_color }) {
  return <Container style={{ backgroundColor: color, color: text_color }}>{short_name}</Container>;
}
