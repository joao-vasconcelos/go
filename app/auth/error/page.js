'use client';

import { useRouter, useSearchParams } from 'next/navigation';
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

export default function AuthError() {
  //
  const router = useRouter();
  const { error } = useSearchParams();

  const getErrorMessage = () => {
    switch (error) {
      case 'Configuration':
        return 'There is a problem with the server configuration.';
      case 'AccessDenied':
        return 'You cannot login with this email.';
      case 'Verification':
        return 'The token has expired or has already been used.';
      default:
        return 'Unkown issue.';
    }
  };

  const handleSignInRetry = () => {
    router.push('/auth/signin');
  };

  return (
    <FlexWrapper>
      <Text type={'error'}>{getErrorMessage()}</Text>
      <Button fullWidth variant='light' onClick={handleSignInRetry}>
        Go Back
      </Button>
    </FlexWrapper>
  );
}
