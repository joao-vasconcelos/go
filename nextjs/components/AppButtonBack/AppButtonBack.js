'use client';

/* * */

import { useRouter } from '@/translations/navigation';
import { ActionIcon, Tooltip } from '@mantine/core';
import { IconChevronLeft } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

/* * */

export default function AppButtonBack({ href = '', onClick = () => null }) {
	//

	//
	// A. Setup variables

	const router = useRouter();
	const t = useTranslations('AppButtonBack');

	//
	// B. Handle actions

	const handleClick = () => {
		if (!href) onClick();
		else if (href) router.push(href);
	};

	//
	// C. Render components

	return (
		<Tooltip color="gray" label={t('label')} position="bottom" withArrow>
			<ActionIcon color="gray" onClick={handleClick} size="lg" variant="subtle">
				<IconChevronLeft size={20} />
			</ActionIcon>
		</Tooltip>
	);

	//
}
