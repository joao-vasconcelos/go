'use client';

import { useRouter } from 'next-intl/client';
import { Button, SimpleGrid, Text } from '@mantine/core';
import { useTranslations } from 'next-intl';

export default function AuthVerify() {
  //
  const router = useRouter();
  const t = useTranslations('auth.verify');

  const handleSignInRetry = () => {
    router.push('/auth/signin');
  };

  return (
    <SimpleGrid>
      <Text align='center'>{t('instruction')}</Text>
      <Button fullWidth variant='light' onClick={handleSignInRetry}>
        {t('submit')}
      </Button>
    </SimpleGrid>
  );
}
