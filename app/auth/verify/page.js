'use client';

import { useRouter } from 'next/navigation';
import { styled } from '@stitches/react';
import { Button } from '@mantine/core';

const FlexWrapper = styled('div', {
  width: '100%',
  padding: '$lg',
  display: 'flex',
  flexDirection: 'column',
  gap: '$md',
});

const Text = styled('p', {
  textAlign: 'center',
  variants: {
    type: {
      error: {
        color: '$danger5',
        fontWeight: '$bold',
      },
    },
  },
});

export default function AuthVerify() {
  //
  const router = useRouter();

  const handleSignInRetry = () => {
    router.push('/auth/signin');
  };

  return (
    <FlexWrapper>
      <Text>Please check your email.</Text>
      <Button fullWidth variant='light' onClick={handleSignInRetry}>
        I did not receive my email
      </Button>
    </FlexWrapper>
  );
}
