/* * */

import styles from './AppSidebar.module.css';
import { Link } from '@/translations/navigation';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Tooltip, ActionIcon } from '@mantine/core';
import { IconChartArcs, IconBusStop, IconArrowLoopRight, IconCalendarDue, IconFileZip, IconChartArrowsVertical, IconUsers, IconDatabaseCog, IconTag } from '@tabler/icons-react';
import AuthGate from '@/components/AuthGate/AuthGate';

/* * */

export default function AppSidebar() {
  //

  //
  // A. Setup variables

  const pathname = usePathname();
  const t = useTranslations('AppSidebar');

  const links = [
    { href: 'issues', label: t('issues'), icon: <IconChartArcs />, auth_scope: 'configs', auth_permission: 'admin' },
    { href: 'tags', label: t('tags'), icon: <IconTag />, auth_scope: 'configs', auth_permission: 'admin' },
    { href: 'stops', label: t('stops'), icon: <IconBusStop />, auth_scope: 'stops', auth_permission: 'view' },
    { href: 'lines', label: t('lines'), icon: <IconArrowLoopRight />, auth_scope: 'lines', auth_permission: 'view' },
    { href: 'calendars', label: t('calendars'), icon: <IconCalendarDue />, auth_scope: 'calendars', auth_permission: 'view' },
    { href: 'exports', label: t('exports'), icon: <IconFileZip />, auth_scope: 'exports', auth_permission: 'view' },
    { href: 'realtime', label: t('realtime'), icon: <IconChartArrowsVertical />, auth_scope: 'configs', auth_permission: 'admin' },
    { href: 'users', label: t('users'), icon: <IconUsers />, auth_scope: 'users', auth_permission: 'view' },
    { href: 'configs', label: t('configs'), icon: <IconDatabaseCog />, auth_scope: 'configs', auth_permission: 'admin' },
    // { href: 'alerts', label: t('alerts'), icon: <IconAlertTriangle />, auth_scope: 'alerts', auth_permission: 'view' },
    // { href: 'statistics', label: t('statistics'), icon: <IconChartPie />, auth_scope: 'configs', auth_permission: 'admin' },
    // { href: 'feedback', label: t('feedback'), icon: <IconMoodSearch />, auth_scope: 'users', auth_permission: 'view' },
  ];

  //
  // B. Transform data

  const isActivePage = (href) => {
    if (href === '' && pathname === '') {
      return false;
    } else if (href === '/' && pathname === '/') {
      return true;
    } else if (pathname != '/' && href != '/') {
      return pathname.includes(href);
    }
  };

  //
  // C. Render components

  return (
    <div className={styles.container}>
      <div className={styles.navWrapper}>
        {links.map((item) => {
          return (
            <AuthGate key={item.href} scope={item.auth_scope} permission={item.auth_permission}>
              <Tooltip label={item.label} position="right">
                <Link href={'/dashboard/' + item.href} scroll={false}>
                  <ActionIcon className={`${styles.navButton} ${isActivePage(item.href) && styles.selected}`} size="xl" color="gray">
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

  //
}
