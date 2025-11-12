/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import { Link } from '@/translations/navigation';
import { ActionIcon, Tooltip } from '@mantine/core';
import { IconArrowLoopRight, IconBuildingCommunity, IconBusStop, IconCalendarDue, IconChartPie, IconDatabaseCog, IconFile3d, IconFileZip, IconLayoutCollage, IconMapHeart, IconSparkles, IconTicket, IconTopologyStar3, IconUsers } from '@tabler/icons-react';
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
		// External link to GO v2
		{ href: 'https://go.tmlmobilidade.pt', icon: <IconSparkles />, label: t('go_v2'), permissions: [], type: 'external' },
		{ href: 'https://go.tmlmobilidade.pt/stops', icon: <IconBusStop />, label: t('stops'), permissions: [{ action: 'navigate', scope: 'stops' }], type: 'external' },
		// Internal links
		{ href: 'reports', icon: <IconChartPie />, label: t('reports'), permissions: [{ action: 'navigate', scope: 'reports' }] },
		{ href: 'calendars', icon: <IconCalendarDue />, label: t('calendars'), permissions: [{ action: 'navigate', scope: 'calendars' }] },
		{ href: 'lines', icon: <IconArrowLoopRight />, label: t('lines'), permissions: [{ action: 'navigate', scope: 'lines' }] },
		{ href: 'exports', icon: <IconFileZip />, label: t('exports'), permissions: [{ action: 'navigate', scope: 'exports' }] },
		{ href: 'municipalities', icon: <IconMapHeart />, label: t('municipalities'), permissions: [{ action: 'navigate', scope: 'municipalities' }] },
		{ href: 'zones', icon: <IconLayoutCollage />, label: t('zones'), permissions: [{ action: 'navigate', scope: 'zones' }] },
		{ href: 'fares', icon: <IconTicket />, label: t('fares'), permissions: [{ action: 'navigate', scope: 'fares' }] },
		{ href: 'typologies', icon: <IconTopologyStar3 />, label: t('typologies'), permissions: [{ action: 'navigate', scope: 'typologies' }] },
		{ href: 'agencies', icon: <IconBuildingCommunity />, label: t('agencies'), permissions: [{ action: 'navigate', scope: 'agencies' }] },
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
				{links.map(item => (
					<AppAuthenticationCheck key={item.href} permissions={item.permissions}>
						<Tooltip label={item.label} position="right">
							<Link href={item.type === 'external' ? item.href : `/${item.href}`} scroll={false} target={item.type === 'external' ? '_blank' : undefined}>
								<ActionIcon className={`${styles.navButton} ${isActivePage(item.href) && styles.selected}`} color="gray" size="xl">
									{item.icon}
								</ActionIcon>
							</Link>
						</Tooltip>
					</AppAuthenticationCheck>
				))}
			</div>
		</div>
	);

	//
}
