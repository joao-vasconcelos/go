'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button, SimpleGrid, Text } from '@mantine/core';
import { useTranslations } from 'next-intl';

export default function AuthError() {
  //
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const t = useTranslations('auth.error');

  const getErrorMessage = () => {
    switch (searchParams.get('error')) {
      case 'Configuration':
        return t('type.configuration');
      case 'AccessDenied':
        return t('type.access-denied');
      case 'Verification':
        return t('type.verification');
      default:
        return t('type.unknown');
    }
  };

  const handleSignInRetry = () => {
    router.push('/auth/signin');
  };

  if (status === 'authenticated') {
    if (searchParams.get('callbackUrl')) router.push(searchParams.get('callbackUrl'));
    else router.push('/dashboard/');
  } else {
    return (
      <SimpleGrid>
        <Text color='red' align='center' fw='bold'>
          {getErrorMessage()}
        </Text>
        <Button fullWidth variant='light' onClick={handleSignInRetry}>
          {t('submit')}
        </Button>
      </SimpleGrid>
    );
  }
}
