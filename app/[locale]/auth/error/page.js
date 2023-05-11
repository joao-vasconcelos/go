'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button, SimpleGrid, Text } from '@mantine/core';
import { useTranslations } from 'next-intl';

export default function AuthError() {
  //
  const router = useRouter();
  const searchParams = useSearchParams();
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
