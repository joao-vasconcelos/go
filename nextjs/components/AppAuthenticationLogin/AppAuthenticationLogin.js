'use client';

/* * */

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { TextInput, Button, SimpleGrid } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import { EmailDefault } from '@/schemas/Email/default';
import { EmailValidation } from '@/schemas/Email/validation';
import { useTranslations } from 'next-intl';

/* * */

export default function AppAuthenticationLogin() {
  //

  //
  // A. Setup variables

  const t = useTranslations('AppAuthenticationLogin');
  const [isLoading, setIsLoading] = useState(false);

  //
  // B. Setup form

  const form = useForm({
    clearInputErrorOnChange: true,
    validate: yupResolver(EmailValidation),
    initialValues: EmailDefault,
  });

  //
  // C. Handle actions

  const handleSignIn = async () => {
    setIsLoading(true);
    signIn('email', { email: form.values.email, callbackUrl: '/' });
  };

  //
  // D. Render components

  return (
    <form onSubmit={form.onSubmit(handleSignIn)}>
      <SimpleGrid>
        <TextInput aria-label={t('email.label')} placeholder={t('email.placeholder')} {...form.getInputProps('email')} disabled={isLoading} />
        <Button type={'submit'} fullWidth loading={isLoading}>
          {t('login.label')}
        </Button>
      </SimpleGrid>
    </form>
  );

  //
}
