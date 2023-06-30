import styles from './AppSidebar.module.css';
import Link from 'next-intl/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Tooltip, ActionIcon } from '@mantine/core';
import { IconChartPie, IconAlertTriangle, IconBusStop, IconArrowLoopRight, IconCalendarDue, IconShape2, IconMessageChatbot, IconFileZip, IconUsers, IconMoodSearch } from '@tabler/icons-react';
import AuthGate from '../AuthGate/AuthGate';

export default function AppSidebar() {
  //

  const pathname = usePathname();
  const t = useTranslations('AppSidebar');

  const links = [
    { href: 'statistics', label: t('statistics'), icon: <IconChartPie />, auth_scope: 'statistics', auth_permission: 'view' },
    { href: 'alerts', label: t('alerts'), icon: <IconAlertTriangle />, auth_scope: 'alerts', auth_permission: 'view' },
    { href: 'stops', label: t('stops'), icon: <IconBusStop />, auth_scope: 'stops', auth_permission: 'view' },
    { href: 'lines', label: t('lines'), icon: <IconArrowLoopRight />, auth_scope: 'lines', auth_permission: 'view' },
    { href: 'calendars', label: t('calendars'), icon: <IconCalendarDue />, auth_scope: 'calendars', auth_permission: 'view' },
    { href: 'threads', label: t('threads'), icon: <IconMessageChatbot />, auth_scope: 'threads', auth_permission: 'view' },
    { href: 'export', label: t('export'), icon: <IconFileZip />, auth_scope: 'export', auth_permission: 'view' },
    { href: 'users', label: t('users'), icon: <IconUsers />, auth_scope: 'users', auth_permission: 'view' },
    // { href: 'feedback', label: t('feedback'), icon: <IconMoodSearch />, auth_scope: 'users', auth_permission: 'view' },
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
            <AuthGate key={item.href} scope={item.auth_scope} permission={item.auth_permission}>
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
