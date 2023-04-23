'use client';

import ScrollList from '../../../components/lists/ScrollList';
import { styled } from '@stitches/react';

const Container = styled('div', {
  display: 'grid',
  gridTemplateColumns: '350px 1fr',
  gap: '$md',
  width: '100%',
  height: '100%',
});

export default function Layout({ children }) {
  return (
    <Container>
      <ScrollList data={[]} />
      <div>{children}</div>
    </Container>
  );
}
