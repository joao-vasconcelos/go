'use client';

import { styled } from '@stitches/react';
import { Loader, LoadingOverlay } from '@mantine/core';

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '$gray0',
  border: '1px solid $gray4',
  borderRadius: '$md',
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  overflow: 'auto',
});

const LoadingWrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  overflow: 'scroll',
});

const Header = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '$sm',
  padding: '$sm',
  width: '100%',
  borderBottom: '1px solid $gray4',
});

const Body = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  overflow: 'scroll',
});

const Footer = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '$sm',
  padding: '$sm',
  width: '100%',
  borderTop: '1px solid $gray4',
});

export default function Pannel({ loading, header, children, footer }) {
  //

  return (
    <Container>
      <LoadingOverlay visible={loading} overlayBlur={2} transitionDuration={500} loaderProps={{ size: 'md', color: 'gray' }} />
      {header && <Header>{header}</Header>}
      <Body>{children}</Body>
      {footer && <Footer>{footer}</Footer>}
    </Container>
  );

  //
}
