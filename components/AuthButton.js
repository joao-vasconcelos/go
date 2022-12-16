import { styled } from '@stitches/react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { TbLogout, TbLogin } from 'react-icons/tb';

const LoginButton = styled('div', {
  display: 'flex',
  alignItems: 'center',
  color: '$gray12',
  padding: '$sm',
  fontSize: '$lg',
  fontWeight: 700,
  gap: '$md',
  transition: 'all 100ms ease-in-out',
  cursor: 'pointer',
  variants: {
    authenticated: {
      true: {
        color: '$danger5',
        '&:hover': {
          backgroundColor: '$danger5',
          color: '$gray0',
        },
        '&:active': {
          backgroundColor: '$danger6',
          color: '$gray0',
        },
      },
      false: {
        color: '$gray12',
        '&:hover': {
          backgroundColor: '$gray2',
          color: '$gray12',
        },
        '&:active': {
          backgroundColor: '$gray4',
          color: '$gray12',
        },
      },
    },
  },
});

export default function AuthButton() {
  //

  const { data: session } = useSession();

  if (session) {
    return (
      <LoginButton authenticated={true} onClick={() => signOut()}>
        <TbLogout />
        <span>Logout</span>
      </LoginButton>
    );
  } else {
    return (
      <LoginButton authenticated={false} onClick={() => signIn()}>
        <TbLogin />
        <span>Sign in</span>
      </LoginButton>
    );
  }
}
