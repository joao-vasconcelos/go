'use client';

import { styled } from '@stitches/react';

const Container = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  color: '$gray12',
  fontSize: '15px',
  fontWeight: 'bold',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  lineClamp: 2,
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
});

export default function LineName({ long_name, color, textColor }) {
  //

  return <Container>{long_name}</Container>;
}
