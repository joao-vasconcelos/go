import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { styled } from '@stitches/react';
import { signIn } from 'next-auth/react';
import { TextInput, Button, Divider } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import Schema from '../../schemas/Email';
import Image from 'next/image';
import appBackground from '../../public/background.jpg';
import carrisMetropolitanaLogo from '../../public/carris-metropolitana.svg';

const Container = styled('div', {
  position: 'fixed',
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '$lg',
  padding: '$lg',
  backgroundColor: '$gray1',
  backgroundImage: `url('${appBackground.src}')`,
  backgroundSize: 'cover',
  backgroundPosition: '50%',
  backgroundRepeat: 'no-repeat',
});

const LoginForm = styled('div', {
  width: '25%',
  maxWidth: '300px',
  background: '$gray0',
  borderRadius: '$md',
  boxShadow: '$xl',
});

const FlexWrapper = styled('div', {
  width: '100%',
  padding: '$lg',
  display: 'flex',
  flexDirection: 'column',
  gap: '$md',
});

const AppLogo = styled(Image, {
  display: 'flex',
  width: '100%',
  margin: 'auto',
  height: 'auto',
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

//
//
//

export default function AuthStepSwitcher() {
  //
  const router = useRouter();
  const { status } = useSession();

  const { authstep, callbackUrl } = router.query;

  if (status === 'authenticated') {
    if (callbackUrl) router.push(callbackUrl);
    else router.push('/');
  } else {
    switch (authstep) {
      case 'error':
        return <AuthError />;
      case 'verify':
        return <AuthVerify />;
      default:
        return <AuthSignIn />;
    }
  }
}

//
//
//

export function AuthSignIn() {
  //

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    clearInputErrorOnChange: true,
    validate: yupResolver(Schema),
    initialValues: {
      email: '',
    },
  });

  const handleSignIn = async () => {
    setIsLoading(true);
    signIn('email', { email: form.values.email });
  };

  return (
    <Container>
      <LoginForm shadow='lg'>
        <FlexWrapper>
          <AppLogo priority src={carrisMetropolitanaLogo} alt={'Carris Metropolitana'} />
        </FlexWrapper>
        <Divider />
        <form onSubmit={form.onSubmit(handleSignIn)}>
          <FlexWrapper>
            <TextInput placeholder='email@tmlmobilidade.pt' {...form.getInputProps('email')} />
            <Button type={'submit'} fullWidth loading={isLoading}>
              Sign in
            </Button>
          </FlexWrapper>
        </form>
      </LoginForm>
    </Container>
  );
}

//
//
//

export function AuthVerify() {
  //
  const router = useRouter();

  const handleSignInRetry = () => {
    router.push('/auth/signin');
  };

  return (
    <Container>
      <LoginForm shadow='lg'>
        <FlexWrapper>
          <AppLogo priority src={carrisMetropolitanaLogo} alt={'Carris Metropolitana'} />
        </FlexWrapper>
        <Divider />
        <FlexWrapper>
          <Text>Please check your email.</Text>
          <Button fullWidth variant='light' onClick={handleSignInRetry}>
            I did not receive my email
          </Button>
        </FlexWrapper>
      </LoginForm>
    </Container>
  );
}

//
//
//

export function AuthError() {
  //
  const router = useRouter();
  const { error } = router.query;

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
    <Container>
      <LoginForm shadow='lg'>
        <FlexWrapper>
          <AppLogo priority src={carrisMetropolitanaLogo} alt={'Carris Metropolitana'} />
        </FlexWrapper>
        <Divider />
        <FlexWrapper>
          <Text type={'error'}>{getErrorMessage()}</Text>
          <Button fullWidth variant='light' onClick={handleSignInRetry}>
            Go Back
          </Button>
        </FlexWrapper>
      </LoginForm>
    </Container>
  );
}
