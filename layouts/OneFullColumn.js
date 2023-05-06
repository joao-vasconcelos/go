'use client';

import { styled } from '@stitches/react';

const Container = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gridTemplateRows: '1fr',
  alignItems: 'stretch',
  justifyContent: 'stretch',
  gap: '$md',
  width: '100%',
  height: '100%',
  flexGrow: 1,
  position: 'relative',
  width: '100%',
});

const Wrapper = styled('div', {
  width: '100%',
  height: '100%',
  flexGrow: 1,
  position: 'relative',
  width: '100%',
});

export default function OneFullColumn({ first }) {
  return <Container>{first && <Wrapper>{first}</Wrapper>}</Container>;
}
