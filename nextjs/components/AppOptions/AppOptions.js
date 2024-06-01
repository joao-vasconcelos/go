'use client';

/* * */

import { availableLocales } from '@/translations/config';
import { usePathname } from '@/translations/navigation';
import { ActionIcon, Menu } from '@mantine/core';
import { IconLanguage, IconLogin, IconSettings } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import pjson from 'package.json';

/* * */

export default function AppOptions() {
	//

	//
	// A. Setup variables

	const locale = useLocale();
	const router = useRouter();
	const pathname = usePathname();

	const t = useTranslations('AppOptions');

	//
	// B. Handle actions

	const handleLocaleSwitch = (selectedLocale) => {
		router.replace(`/${selectedLocale}${pathname}`);
	};

	const handleLogout = () => {
		signOut();
	};

	//
	// C. Render components

	return (
		<Menu offset={15} position="bottom-end" shadow="lg">
			<Menu.Target>
				<ActionIcon color="gray" size="lg" variant="subtle">
					<IconSettings size={20} />
				</ActionIcon>
			</Menu.Target>
			<Menu.Dropdown>
				<Menu.Label>{t('language.label')}</Menu.Label>
				{availableLocales.map(availableLocale => (
					<Menu.Item key={availableLocale} disabled={locale === availableLocale} icon={<IconLanguage size={20} />} onClick={() => handleLocaleSwitch(availableLocale)}>
						{t(`language.locale.${availableLocale}`)}
					</Menu.Item>
				))}
				<Menu.Divider />
				<Menu.Item color="red" icon={<IconLogin size={20} />} onClick={handleLogout}>
					{t('auth.logout')}
				</Menu.Item>
				<Menu.Divider />
				<Menu.Label>{t('version.label', { version: pjson.version })}</Menu.Label>
			</Menu.Dropdown>
		</Menu>
	);

	//
}
