import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { styled } from '@stitches/react';
import { Navbar, ScrollArea, Divider } from '@mantine/core';
import carrisMetropolitanaLogo from '../public/carris-metropolitana.svg';
import { TbLogout } from 'react-icons/tb';
import AppVersion from './AppVersion';

const AppLogo = styled(Image, {
  display: 'flex',
  width: '100%',
  maxWidth: '200px',
  height: 'auto',
  padding: '$md',
  paddingBottom: '$xs',
  paddingTop: '$lg',
});

const NavButton = styled(Link, {
  display: 'flex',
  alignItems: 'center',
  color: '$gray12',
  padding: '$sm',
  color: '$gray12',
  fontSize: '$lg',
  fontWeight: 700,
  gap: '$md',
  '&:hover': {
    backgroundColor: '$gray2',
    color: '$gray12',
  },
  variants: {
    active: {
      true: {
        backgroundColor: '$primary5',
        color: '$gray12',
        '&:hover': {
          backgroundColor: '$primary5',
          color: '$gray12',
        },
      },
    },
    danger: {
      true: {
        color: '$danger5',
        '&:hover': {
          backgroundColor: '$danger5',
          color: '$gray0',
        },
      },
    },
  },
});

export default function NavigationBar({ links = [] }) {
  //

  const router = useRouter();

  function isActivePage(href) {
    if (href === '' && router.asPath === '') {
      return false;
    } else if (href === '/' && router.asPath === '/') {
      return true;
    } else if (router.asPath != '/' && href != '/') {
      return router.asPath.includes(href);
    }
  }

  return (
    <Navbar width={{ sm: 250 }}>
      <Navbar.Section>
        <AppLogo priority src={carrisMetropolitanaLogo} alt={'Carris Metropolitana'} />
      </Navbar.Section>
      <Divider my='md' />
      <Navbar.Section grow>
        <ScrollArea>
          {links.map((item) => (
            <NavButton active={isActivePage(item.href)} href={item.href} key={item.label}>
              <item.icon />
              <span>{item.label}</span>
            </NavButton>
          ))}
        </ScrollArea>
      </Navbar.Section>

      <Divider my='0' />
      <Navbar.Section>
        <NavButton danger href={'/logout'}>
          <TbLogout />
          <span>Terminar Sessão</span>
        </NavButton>
      </Navbar.Section>
      <Divider my='0' />
      <AppVersion />
    </Navbar>
  );
}
