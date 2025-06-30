/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import { Link } from '@/translations/navigation';
import { ActionIcon, Tooltip } from '@mantine/core';
import {
	IconArrowLoopRight,
	IconBuildingCommunity,
	IconBusStop,
	IconCalendarDue,
	IconChartArcs,
	IconChartPie,
	IconDatabaseCog,
	IconFile3d,
	IconFileZip,
	IconLayoutCollage,
	IconMapHeart,
	IconTag,
	IconTicket,
	IconTopologyStar3,
	IconUsers,
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

import styles from './AppSidebar.module.css';

/* * */

export default function AppSidebar() {
	//

	//
	// A. Setup variables

	const pathname = usePathname();
	const t = useTranslations('AppSidebar');

	const links = [
		{ href: 'reports', icon: <IconChartPie />, label: t('reports'), permissions: [{ action: 'navigate', scope: 'reports' }] },
		{ href: 'issues', icon: <IconChartArcs />, label: t('issues'), permissions: [{ action: 'navigate', scope: 'issues' }] },
		{ href: 'stops', icon: <IconBusStop />, label: t('stops'), permissions: [{ action: 'navigate', scope: 'stops' }] },
		{ href: 'calendars', icon: <IconCalendarDue />, label: t('calendars'), permissions: [{ action: 'navigate', scope: 'calendars' }] },
		{ href: 'lines', icon: <IconArrowLoopRight />, label: t('lines'), permissions: [{ action: 'navigate', scope: 'lines' }] },
		{ href: 'exports', icon: <IconFileZip />, label: t('exports'), permissions: [{ action: 'navigate', scope: 'exports' }] },
		{ href: 'municipalities', icon: <IconMapHeart />, label: t('municipalities'), permissions: [{ action: 'navigate', scope: 'municipalities' }] },
		{ href: 'zones', icon: <IconLayoutCollage />, label: t('zones'), permissions: [{ action: 'navigate', scope: 'zones' }] },
		{ href: 'fares', icon: <IconTicket />, label: t('fares'), permissions: [{ action: 'navigate', scope: 'fares' }] },
		{ href: 'typologies', icon: <IconTopologyStar3 />, label: t('typologies'), permissions: [{ action: 'navigate', scope: 'typologies' }] },
		{ href: 'agencies', icon: <IconBuildingCommunity />, label: t('agencies'), permissions: [{ action: 'navigate', scope: 'agencies' }] },
		{ href: 'tags', icon: <IconTag />, label: t('tags'), permissions: [{ action: 'navigate', scope: 'tags' }] },
		{ href: 'media', icon: <IconFile3d />, label: t('media'), permissions: [{ action: 'navigate', scope: 'media' }] },
		{ href: 'users', icon: <IconUsers />, label: t('users'), permissions: [{ action: 'navigate', scope: 'users' }] },
		{ href: 'configs', icon: <IconDatabaseCog />, label: t('configs'), permissions: [{ action: 'admin', scope: 'configs' }] },
	];

	//
	// B. Transform data

	const isActivePage = (href) => {
		if (href === '' && pathname === '') {
			return false;
		}
		else if (href === '/' && pathname === '/') {
			return true;
		}
		else if (pathname != '/' && href != '/') {
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
								<Link href={`/${item.href}`} scroll={false}>
									<ActionIcon className={`${styles.navButton} ${isActivePage(item.href) && styles.selected}`} color="gray" size="xl">
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
