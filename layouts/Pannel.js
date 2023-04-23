'use client';

import { styled } from '@stitches/react';

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '$gray0',
  border: '1px solid $gray5',
  borderRadius: '$md',
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  overflow: 'auto',
});

const Header = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '$sm',
  padding: '$sm',
  width: '100%',
  borderBottom: '1px solid $gray5',
});

const Body = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr',
  width: '100%',
  overflow: 'scroll',
  gap: '1px',
});

const Footer = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '$sm',
  padding: '$sm',
  width: '100%',
  borderTop: '1px solid $gray6',
});

export default function Pannel({ header, children, footer }) {
  return (
    <Container>
      {header && <Header>{header}</Header>}
      <Body>{children}</Body>
      {footer && <Footer>{footer}</Footer>}
    </Container>
  );
}
