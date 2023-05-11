import styles from './AppSidebar.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Tooltip, ActionIcon } from '@mantine/core';
import { IconChartPie, IconAlertTriangle, IconBusStop, IconArrowLoopRight, IconCalendarDue, IconShape2, IconCoins, IconBuildingCommunity, IconMessageChatbot, IconFileZip, IconUsers } from '@tabler/icons-react';

export default function AppSidebar() {
  //

  const pathname = usePathname();
  const t = useTranslations('AppSidebar');

  const links = [
    // { href: 'statistics', label: t('statistics'), icon: <IconChartPie />, disabled: true },
    // { href: 'alerts', label: t('alerts'), icon: <IconAlertTriangle />, disabled: true },
    { href: 'stops', label: t('stops'), icon: <IconBusStop /> },
    { href: 'lines', label: t('lines'), icon: <IconArrowLoopRight /> },
    { href: 'calendars', label: t('calendars'), icon: <IconCalendarDue /> },
    { href: 'shapes', label: t('shapes'), icon: <IconShape2 /> },
    { href: 'fares', label: t('fares'), icon: <IconCoins /> },
    { href: 'agencies', label: t('agencies'), icon: <IconBuildingCommunity /> },
    // { href: 'threads', label: t('threads'), icon: <IconMessageChatbot />, disabled: true },
    { href: 'export', label: t('export'), icon: <IconFileZip /> },
    { href: 'users', label: t('users'), icon: <IconUsers /> },
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
            <Tooltip key={item.href} label={item.label} color='gray' position='right'>
              <Link href={'/dashboard/' + item.href}>
                <ActionIcon className={`${styles.navButton} ${isActivePage(item.href) && styles.selected}`} size='xl'>
                  {item.icon}
                </ActionIcon>
              </Link>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}
