'use client';

import { styled } from '@stitches/react';
import LineBadge from './LineBadge';
import LineName from './LineName';

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '$sm',
  width: '100%',
});

export default function Line({ short_name, long_name, color, text_color }) {
  //

  return (
    <Container>
      <LineBadge short_name={short_name} color={color} text_color={text_color} />
      <LineName long_name={long_name} />
    </Container>
  );
}
