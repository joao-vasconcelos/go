'use client';

import { AppShell, Navbar, Header, ScrollArea, Divider } from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { styled } from '@stitches/react';
import carrisMetropolitanaIcon from '../../public/appicon.svg';
import AppVersion from '../../components/AppVersion';
import LoginButton from '../../components/AuthButton';
import { TbHome, TbCalendarDue, TbArrowLoopRight, TbMap, TbUsers } from 'react-icons/tb';
import { SessionProvider } from 'next-auth/react';

const AppLogo = styled(Image, {
  display: 'flex',
  width: '85px',
  height: '50px',
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
  transition: 'all 100ms ease-in-out',
  '&:hover': {
    backgroundColor: '$gray2',
    color: '$gray12',
  },
  '&:active': {
    backgroundColor: '$gray4',
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

// {children} will be a page or nested layout
export default function DashboardLayout({ children, session }) {
  //

  const links = [
    { href: '/', label: 'Home', icon: <TbHome /> },
    { href: 'stops', label: 'Paragens', icon: <TbMap /> },
    { href: 'lines', label: 'Linhas', icon: <TbArrowLoopRight /> },
    { href: 'calendars', label: 'Calendários', icon: <TbCalendarDue /> },
    { href: 'users', label: 'Utilizadores', icon: <TbUsers /> },
  ];

  const pathname = usePathname();

  const isActivePage = (href) => {
    if (href === '' && pathname === '') {
      return false;
    } else if (href === '/' && pathname === '/') {
      return true;
    } else if (pathname != '/' && href != '/') {
      return pathname.includes(href);
    }
  };

  return (
    <SessionProvider session={session}>
      <AppShell
        padding='xs'
        navbar={
          <Navbar width={{ sm: 250 }}>
            <Navbar.Section p={'md'} mt={'md'}>
              project title
            </Navbar.Section>
            <Divider my='md' />
            <Navbar.Section grow>
              <ScrollArea>
                {links.map((item) => (
                  <NavButton active={isActivePage(item.href)} href={'/dashboard/' + item.href} key={item.label}>
                    {item.icon}
                    <span>{item.label}</span>
                  </NavButton>
                ))}
              </ScrollArea>
            </Navbar.Section>

            <Divider my='0' />
            <Navbar.Section>
              <LoginButton />
            </Navbar.Section>
            <Divider my='0' />
            <AppVersion />
          </Navbar>
        }
        header={
          <Header height={50} p='0'>
            <AppLogo priority src={carrisMetropolitanaIcon} alt={'Carris Metropolitana'} />
          </Header>
        }
        styles={(theme) => ({
          main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
        })}
      >
        {children}
      </AppShell>
    </SessionProvider>
  );
}
