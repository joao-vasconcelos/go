import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { styled } from '@stitches/react';
import { Tooltip, ActionIcon } from '@mantine/core';
import { TbChartPie, TbFileZip, TbBusStop, TbBuildingCommunity, TbShape2, TbCoins, TbCalendarDue, TbLiveView, TbLogin, TbArrowLoopRight, TbUsers } from 'react-icons/tb';

const Container = styled('div', {
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '$xs',
  justifyContent: 'space-between',
  backgroundColor: '$gray0',
  borderRight: '1px solid $gray3',
  boxShadow: '$xs',
});

const NavWrapper = styled('div', {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '$md',
  padding: '$lg',
  alignItems: 'center',
  variants: {
    grow: {
      true: {
        overflowY: 'scroll',
        height: '100%',
      },
    },
  },
});

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

export default function Component() {
  //

  const links = [
    { href: 'statistics', label: 'Estatísticas', icon: <TbChartPie /> },
    { href: 'stops', label: 'Paragens', icon: <TbBusStop /> },
    { href: 'lines', label: 'Linhas', icon: <TbArrowLoopRight /> },
    { href: 'calendars', label: 'Calendários', icon: <TbCalendarDue /> },
    { href: 'shapes', label: 'Shapes', icon: <TbShape2 /> },
    { href: 'fares', label: 'Tarifários', icon: <TbCoins /> },
    { href: 'agencies', label: 'Agências', icon: <TbBuildingCommunity /> },
    { href: 'export', label: 'Exportar GTFS', icon: <TbFileZip /> },
    { href: 'realtime', label: 'Tempo Real', icon: <TbLiveView />, disabled: true },
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
    <Container>
      <NavWrapper grow>
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
      </NavWrapper>
      <NavWrapper>
        <Tooltip label='Logout' color='gray' position='right'>
          <NavButton danger size='xl' onClick={handleLogout}>
            <TbLogin />
          </NavButton>
        </Tooltip>
      </NavWrapper>
    </Container>
  );
}
