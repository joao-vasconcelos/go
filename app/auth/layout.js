'use client';

import { styled } from '@stitches/react';
import Image from 'next/image';
import { Divider } from '@mantine/core';
import appBackground from '../../public/background.jpg';
import carrisMetropolitanaLogo from '../../public/carris-metropolitana.svg';
import { SessionProvider } from 'next-auth/react';

const Container = styled('div', {
  position: 'fixed',
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '$lg',
  padding: '$lg',
  backgroundColor: '$gray1',
  backgroundImage: `url('${appBackground.src}')`,
  backgroundSize: 'cover',
  backgroundPosition: '50%',
  backgroundRepeat: 'no-repeat',
});

const LoginForm = styled('div', {
  width: '25%',
  maxWidth: '300px',
  background: '$gray0',
  borderRadius: '$md',
  boxShadow: '$xl',
});

const FlexWrapper = styled('div', {
  width: '100%',
  padding: '$lg',
  display: 'flex',
  flexDirection: 'column',
  gap: '$md',
});

const AppLogo = styled(Image, {
  display: 'flex',
  width: '100%',
  margin: 'auto',
  height: 'auto',
});

// {children} will be a page or nested layout
export default function DashboardLayout({ children, session }) {
  //

  return (
    <SessionProvider session={session}>
      <Container>
        <LoginForm shadow='lg'>
          <FlexWrapper>
            <AppLogo priority src={carrisMetropolitanaLogo} alt={'Carris Metropolitana'} />
          </FlexWrapper>
          <Divider />
          {children}
        </LoginForm>
      </Container>
    </SessionProvider>
  );
}
