'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button, SimpleGrid, Text } from '@mantine/core';
import { useTranslations } from 'next-intl';

export default function AuthVerify() {
  //
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const t = useTranslations('auth.verify');

  const handleSignInRetry = () => {
    router.push('/auth/signin');
  };

  if (status === 'authenticated') {
    if (searchParams.get('callbackUrl')) router.push(searchParams.get('callbackUrl'));
    else router.push('/dashboard/');
  } else {
    return (
      <SimpleGrid>
        <Text align='center'>{t('instruction')}</Text>
        <Button fullWidth variant='light' onClick={handleSignInRetry}>
          {t('submit')}
        </Button>
      </SimpleGrid>
    );
  }
}
