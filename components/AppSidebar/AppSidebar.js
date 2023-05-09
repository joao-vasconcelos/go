'use client';

import styles from './AppSidebar.module.css';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { styled } from '@stitches/react';
import { Tooltip, ActionIcon } from '@mantine/core';
import { TbChartPie, TbFileZip, TbBusStop, TbBuildingCommunity, TbMessageChatbot, TbShape2, TbCoins, TbCalendarDue, TbLiveView, TbLogin, TbArrowLoopRight, TbUsers, TbAlertTriangle } from 'react-icons/tb';

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
    { href: 'statistics', label: 'Estatísticas', icon: <TbChartPie /> },
    { href: 'alerts', label: 'Alertas', icon: <TbAlertTriangle /> },
    { href: 'stops', label: 'Paragens', icon: <TbBusStop /> },
    { href: 'lines', label: 'Linhas', icon: <TbArrowLoopRight /> },
    { href: 'calendars', label: 'Calendários', icon: <TbCalendarDue /> },
    { href: 'shapes', label: 'Shapes', icon: <TbShape2 /> },
    { href: 'fares', label: 'Tarifários', icon: <TbCoins /> },
    { href: 'agencies', label: 'Agências', icon: <TbBuildingCommunity /> },
    { href: 'threads', label: 'Conversas', icon: <TbMessageChatbot /> },
    { href: 'export', label: 'Exportar GTFS', icon: <TbFileZip /> },
    // { href: 'realtime', label: 'Tempo Real', icon: <TbLiveView />, disabled: true },
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
            <TbLogin />
          </NavButton>
        </Tooltip>
      </div>
    </div>
  );
}
