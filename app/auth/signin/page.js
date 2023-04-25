'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { styled } from '@stitches/react';
import { signIn } from 'next-auth/react';
import { TextInput, Button } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import { Validation } from '../../../schemas/Email';
import { useSession } from 'next-auth/react';

const FlexWrapper = styled('div', {
  width: '100%',
  padding: '$lg',
  display: 'flex',
  flexDirection: 'column',
  gap: '$md',
});

export default function AuthSignIn() {
  //

  const router = useRouter();

  const { status } = useSession();
  const { callbackUrl } = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    clearInputErrorOnChange: true,
    validate: yupResolver(Validation),
    initialValues: {
      email: '',
    },
  });

  const handleSignIn = async () => {
    setIsLoading(true);
    signIn('email', { email: form.values.email });
  };

  if (status === 'authenticated') {
    if (callbackUrl) router.push(callbackUrl);
    else router.push('/dashboard');
  } else {
    return (
      <form onSubmit={form.onSubmit(handleSignIn)}>
        <FlexWrapper>
          <TextInput placeholder='email@tmlmobilidade.pt' {...form.getInputProps('email')} />
          <Button type={'submit'} fullWidth loading={isLoading}>
            Sign in
          </Button>
        </FlexWrapper>
      </form>
    );
  }
}
