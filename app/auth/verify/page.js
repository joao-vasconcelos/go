'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button, SimpleGrid, Text } from '@mantine/core';

export default function AuthVerify() {
  //
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();

  if (status === 'authenticated') {
    if (searchParams.get('callbackUrl')) router.push(searchParams.get('callbackUrl'));
    else router.push('/dashboard/statistics');
  }

  const handleSignInRetry = () => {
    router.push('/auth/signin');
  };

  return (
    <SimpleGrid>
      <Text align='center'>Please check your email.</Text>
      <Button fullWidth variant='light' onClick={handleSignInRetry}>
        I did not receive my email
      </Button>
    </SimpleGrid>
  );
}
