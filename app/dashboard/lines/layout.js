'use client';

import ScrollList from '../../../components/lists/ScrollList';
import { styled } from '@stitches/react';

const Wrapper = styled('div', {
  display: 'grid',
  gridTemplateColumns: '350px 1fr',
  gap: '$sm',
  //   width: '100%',
  height: '100%',
});

export default function Layout({ children }) {
  return (
    <Wrapper>
      <ScrollList />
      {children}
    </Wrapper>
  );
}
