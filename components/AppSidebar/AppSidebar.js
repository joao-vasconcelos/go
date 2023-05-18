import styles from './AppSidebar.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Tooltip, ActionIcon } from '@mantine/core';
import { IconChartPie, IconAlertTriangle, IconBusStop, IconArrowLoopRight, IconCalendarDue, IconShape2, IconCoins, IconBuildingCommunity, IconMessageChatbot, IconFileZip, IconUsers } from '@tabler/icons-react';
import AuthGate from '../AuthGate/AuthGate';

export default function AppSidebar() {
  //

  const pathname = usePathname();
  const t = useTranslations('AppSidebar');

  const links = [
    { href: 'statistics', label: t('statistics'), icon: <IconChartPie />, auth_key: 'statistics_view' },
    { href: 'alerts', label: t('alerts'), icon: <IconAlertTriangle />, auth_key: 'alerts_view' },
    { href: 'stops', label: t('stops'), icon: <IconBusStop />, auth_key: 'stops_view' },
    { href: 'lines', label: t('lines'), icon: <IconArrowLoopRight />, auth_key: 'lines_view' },
    { href: 'calendars', label: t('calendars'), icon: <IconCalendarDue />, auth_key: 'calendars_view' },
    { href: 'shapes', label: t('shapes'), icon: <IconShape2 />, auth_key: 'shapes_view' },
    { href: 'fares', label: t('fares'), icon: <IconCoins />, auth_key: 'fares_view' },
    { href: 'agencies', label: t('agencies'), icon: <IconBuildingCommunity />, auth_key: 'agencies_view' },
    { href: 'threads', label: t('threads'), icon: <IconMessageChatbot />, auth_key: 'threads_view' },
    { href: 'export', label: t('export'), icon: <IconFileZip />, auth_key: 'export_view' },
    { href: 'users', label: t('users'), icon: <IconUsers />, auth_key: 'users_view' },
  ];

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
    <div className={styles.container}>
      <div className={styles.navWrapper}>
        {links.map((item) => {
          return (
            <AuthGate key={item.href} permission={item.auth_key}>
              <Tooltip label={item.label} color='gray' position='right'>
                <Link href={'/dashboard/' + item.href}>
                  <ActionIcon className={`${styles.navButton} ${isActivePage(item.href) && styles.selected}`} size='xl'>
                    {item.icon}
                  </ActionIcon>
                </Link>
              </Tooltip>
            </AuthGate>
          );
        })}
      </div>
    </div>
  );
}
