import { styled } from '@stitches/react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Version from './version';
import carrisMetropolitanaIcon from '../../public/appicon.svg';

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  gap: '$md',
  width: '100%',
  minHeight: '50px',
  backgroundColor: '$gray0',
  borderBottom: '1px solid $gray7',
  boxShadow: '$xs',
  overflow: 'hidden',
});

const AppIcon = styled(Image, {
  width: '85px',
});

const Toolbar = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '$sm $md',
  width: '100%',
  height: '100%',
});

const Greeting = styled('p', {
  fontSize: '$lg',
  fontWeight: '500',
  color: '$gray8',
});

export default function Component() {
  //
  const { data: session, status } = useSession();

  return (
    <Container>
      <AppIcon priority src={carrisMetropolitanaIcon} alt={'Carris Metropolitana'} />
      <Toolbar>
        <Greeting>{`Olá ${(session && session.user.name) || '-'}!`}</Greeting>
        <Version />
      </Toolbar>
    </Container>
  );
}
