'use client';

import { styled } from '@stitches/react';
import AuthGate from '../../../../components/AuthGate/AuthGate';

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

export default function Layout({ children }) {
  return (
    <AuthGate permission='statistics_view' redirect>
      <Container>{children}</Container>;
    </AuthGate>
  );
}
