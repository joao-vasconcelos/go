'use client';

/* * */

import { ActionIcon, Tooltip } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { IconCircleDotted } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

/* * */

export default function AppButtonDelete({ disabled, onClick = async () => null }) {
	//

	//
	// A. Setup variables

	const t = useTranslations('AppButtonDelete');
	const [isLoading, setIsLoading] = useState(false);

	//
	// B. Handle actions

	const handleClick = async () => {
		setIsLoading(true);
		await onClick();
		setIsLoading(false);
	};

	//
	// C. Render components

	if (isLoading) {
		return (
			<ActionIcon size="lg" variant="light" loading>
				<IconCircleDotted size={20} />
			</ActionIcon>
		);
	}

	return (
		<Tooltip color="red" disabled={disabled} label={t('label')} position="bottom" withArrow>
			<ActionIcon color="red" disabled={disabled} onClick={handleClick} size="lg" variant="light">
				<IconTrash size={20} />
			</ActionIcon>
		</Tooltip>
	);

	//
}
