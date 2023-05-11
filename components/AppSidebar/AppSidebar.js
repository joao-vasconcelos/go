'use client';

import styles from './AppSidebar.module.css';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { styled } from '@stitches/react';
import { Tooltip, ActionIcon } from '@mantine/core';
import { IconChartPie, IconFileZip, IconBusStop, IconBuildingCommunity, IconMessageChatbot, IconShape2, IconCoins, IconCalendarDue, IconLiveView, IconLogin, IconArrowLoopRight, IconUsers, IconAlertTriangle } from '@tabler/icons-react';

const NavButton = styled(ActionIcon, {
  color: '$gray12',
  fontSize: '26px',
  '&:hover': {
    backgroundColor: '$gray2',
  },
  '&:active': {
    backgroundColor: '$gray4',
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
    disabled: {
      true: {
        backgroundColor: '$gray2',
        color: '$gray9',
        cursor: 'default',
        '&:active': {
          backgroundColor: '$gray2',
          color: '$gray9',
          transform: 'none',
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
        '&:active': {
          backgroundColor: '$danger6',
        },
      },
    },
  },
});

export default function AppSidebar() {
  //

  const links = [
    { href: 'statistics', label: 'Estatísticas', icon: <IconChartPie /> },
    { href: 'alerts', label: 'Alertas', icon: <IconAlertTriangle /> },
    { href: 'stops', label: 'Paragens', icon: <IconBusStop /> },
    { href: 'lines', label: 'Linhas', icon: <IconArrowLoopRight /> },
    { href: 'calendars', label: 'Calendários', icon: <IconCalendarDue /> },
    { href: 'shapes', label: 'Shapes', icon: <IconShape2 /> },
    { href: 'fares', label: 'Tarifários', icon: <IconCoins /> },
    { href: 'agencies', label: 'Agências', icon: <IconBuildingCommunity /> },
    { href: 'threads', label: 'Conversas', icon: <IconMessageChatbot /> },
    { href: 'export', label: 'Exportar GTFS', icon: <IconFileZip /> },
    // { href: 'realtime', label: 'Tempo Real', icon: <IconLiveView />, disabled: true },
    { href: 'users', label: 'Utilizadores', icon: <IconUsers /> },
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

  const handleLogout = () => {
    signOut();
  };

  return (
    <div className={styles.container}>
      <div className={styles.navWrapper}>
        {links.map((item) => {
          if (item.disabled) {
            return (
              <Tooltip key={item.href} label={item.label} color='gray' position='right'>
                <NavButton active={isActivePage(item.href)} color='dark' size='xl' disabled>
                  {item.icon}
                </NavButton>
              </Tooltip>
            );
          } else {
            return (
              <Tooltip key={item.href} label={item.label} color='gray' position='right'>
                <Link href={'/dashboard/' + item.href}>
                  <NavButton active={isActivePage(item.href)} color='dark' size='xl'>
                    {item.icon}
                  </NavButton>
                </Link>
              </Tooltip>
            );
          }
        })}
      </div>
      <div className={styles.navWrapper}>
        <Tooltip label='Logout' color='gray' position='right'>
          <NavButton danger size='xl' onClick={handleLogout}>
            <IconLogin />
          </NavButton>
        </Tooltip>
      </div>
    </div>
  );
}
