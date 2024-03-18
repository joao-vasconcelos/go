/* * */

import styles from './AppSidebar.module.css';
import { Link } from '@/translations/navigation';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Tooltip, ActionIcon } from '@mantine/core';
import {
  IconAlertTriangle,
  IconChartPie,
  IconClipboardText,
  IconMoodSearch,
  IconChartArcs,
  IconBusStop,
  IconCalendarDue,
  IconArrowLoopRight,
  IconFileZip,
  IconLayoutGridAdd,
  IconMapHeart,
  IconLayoutCollage,
  IconTicket,
  IconTopologyStar3,
  IconBuildingCommunity,
  IconTag,
  IconFile3d,
  IconUsers,
  IconDatabaseCog,
} from '@tabler/icons-react';
import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';

/* * */

export default function AppSidebar() {
  //

  //
  // A. Setup variables

  const pathname = usePathname();
  const t = useTranslations('AppSidebar');

  const links = [
    { href: 'alerts', label: t('alerts'), icon: <IconAlertTriangle />, permissions: [{ scope: 'alerts', action: 'navigate' }] },
    { href: 'reporting', label: t('reporting'), icon: <IconChartPie />, permissions: [{ scope: 'reporting', action: 'navigate' }] },
    { href: 'audits', label: t('audits'), icon: <IconClipboardText />, permissions: [{ scope: 'audits', action: 'view' }] },
    { href: 'feedback', label: t('feedback'), icon: <IconMoodSearch />, permissions: [{ scope: 'feedback', action: 'view' }] },
    { href: 'issues', label: t('issues'), icon: <IconChartArcs />, permissions: [{ scope: 'issues', action: 'navigate' }] },
    { href: 'stops', label: t('stops'), icon: <IconBusStop />, permissions: [{ scope: 'stops', action: 'navigate' }] },
    { href: 'calendars', label: t('calendars'), icon: <IconCalendarDue />, permissions: [{ scope: 'calendars', action: 'navigate' }] },
    { href: 'lines', label: t('lines'), icon: <IconArrowLoopRight />, permissions: [{ scope: 'lines', action: 'navigate' }] },
    { href: 'exports', label: t('exports'), icon: <IconFileZip />, permissions: [{ scope: 'exports', action: 'navigate' }] },
    { href: 'archives', label: t('archives'), icon: <IconLayoutGridAdd />, permissions: [{ scope: 'archives', action: 'navigate' }] },
    { href: 'municipalities', label: t('municipalities'), icon: <IconMapHeart />, permissions: [{ scope: 'municipalities', action: 'navigate' }] },
    { href: 'zones', label: t('zones'), icon: <IconLayoutCollage />, permissions: [{ scope: 'zones', action: 'navigate' }] },
    { href: 'fares', label: t('fares'), icon: <IconTicket />, permissions: [{ scope: 'fares', action: 'navigate' }] },
    { href: 'typologies', label: t('typologies'), icon: <IconTopologyStar3 />, permissions: [{ scope: 'typologies', action: 'navigate' }] },
    { href: 'agencies', label: t('agencies'), icon: <IconBuildingCommunity />, permissions: [{ scope: 'agencies', action: 'navigate' }] },
    { href: 'tags', label: t('tags'), icon: <IconTag />, permissions: [{ scope: 'tags', action: 'navigate' }] },
    { href: 'media', label: t('media'), icon: <IconFile3d />, permissions: [{ scope: 'media', action: 'navigate' }] },
    { href: 'users', label: t('users'), icon: <IconUsers />, permissions: [{ scope: 'users', action: 'navigate' }] },
    { href: 'configs', label: t('configs'), icon: <IconDatabaseCog />, permissions: [{ scope: 'configs', action: 'admin' }] },
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
            <AppAuthenticationCheck key={item.href} permissions={item.permissions}>
              <Tooltip label={item.label} position="right">
                <Link href={'/' + item.href} scroll={false}>
                  <ActionIcon className={`${styles.navButton} ${isActivePage(item.href) && styles.selected}`} size="xl" color="gray">
                    {item.icon}
                  </ActionIcon>
                </Link>
              </Tooltip>
            </AppAuthenticationCheck>
          );
        })}
      </div>
    </div>
  );

  //
}
