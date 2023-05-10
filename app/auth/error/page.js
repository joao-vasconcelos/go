'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button, SimpleGrid, Text } from '@mantine/core';

export default function AuthError() {
  //
  const router = useRouter();
  const searchParams = useSearchParams();

  const getErrorMessage = () => {
    switch (searchParams.get('error')) {
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
    <SimpleGrid>
      <Text color='red' align='center' fw='bold'>
        {getErrorMessage()}
      </Text>
      <Button fullWidth variant='light' onClick={handleSignInRetry}>
        Go Back
      </Button>
    </SimpleGrid>
  );
}
