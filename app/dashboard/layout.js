'use client';

import { styled } from '@stitches/react';
import { SessionProvider } from 'next-auth/react';
import Header from './header';
import Sidebar from './sidebar';

const PageWrapper = styled('div', {
  position: 'fixed',
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
});

const Body = styled('div', {
  width: '100%',
  height: '100%',
  display: 'grid',
  gridTemplateColumns: '85px 1fr',
});

const Content = styled('div', {
  height: '100%',
  padding: '$md',
  background: '$gray1',
});

export default function Layout({ children, session }) {
  //

  return (
    <SessionProvider session={session}>
      <PageWrapper>
        <Header />
        <Body>
          <Sidebar />
          <Content>{children}</Content>
        </Body>
      </PageWrapper>
    </SessionProvider>
  );
}
