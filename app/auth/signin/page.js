'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { TextInput, Button, SimpleGrid } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import { Default as EmailDefault } from '../../../schemas/Email/default';
import { Validation as EmailValidation } from '../../../schemas/Email/validation';
import { useSession } from 'next-auth/react';

export default function AuthSignIn() {
  //

  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    clearInputErrorOnChange: true,
    validate: yupResolver(EmailValidation),
    initialValues: EmailDefault,
  });

  const handleSignIn = async () => {
    setIsLoading(true);
    signIn('email', { email: form.values.email, callbackUrl: '/dashboard/statistics' });
  };

  if (status === 'authenticated') {
    if (searchParams.get('callbackUrl')) router.push(searchParams.get('callbackUrl'));
    else router.push('/dashboard/statistics');
  } else {
    return (
      <form onSubmit={form.onSubmit(handleSignIn)}>
        <SimpleGrid>
          <TextInput placeholder='email@tmlmobilidade.pt' {...form.getInputProps('email')} />
          <Button type={'submit'} fullWidth loading={isLoading}>
            Sign in
          </Button>
        </SimpleGrid>
      </form>
    );
  }
}
