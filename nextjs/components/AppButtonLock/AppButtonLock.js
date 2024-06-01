'use client';

/* * */

import { ActionIcon, Tooltip } from '@mantine/core';
import { IconCircleDotted, IconLock, IconLockOpen } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

/* * */

export default function AppButtonLock({ disabled, isLocked, onClick }) {
	//

	//
	// A. Setup variables

	const t = useTranslations('AppButtonLock');
	const [isLoading, setIsLoading] = useState(false);

	//
	// B. Handle actions

	const handleClick = async () => {
		setIsLoading(true);
		await onClick(!isLocked);
		setIsLoading(false);
	};

	//
	// C. Render components

	if (isLoading || (isLocked !== true && isLocked !== false)) {
		return (
			<ActionIcon size="lg" variant="light" loading>
				<IconCircleDotted size={20} />
			</ActionIcon>
		);
	}

	if (isLocked === true) {
		return (
			<Tooltip color="teal" disabled={disabled} label={t('locked')} position="bottom" withArrow>
				<ActionIcon color="teal" disabled={disabled} onClick={handleClick} size="lg" variant="light">
					<IconLock size={20} />
				</ActionIcon>
			</Tooltip>
		);
	}

	if (isLocked === false) {
		return (
			<Tooltip disabled={disabled} label={t('unlocked')} position="bottom" withArrow>
				<ActionIcon color="blue" disabled={disabled} onClick={handleClick} size="lg" variant="subtle">
					<IconLockOpen size={20} />
				</ActionIcon>
			</Tooltip>
		);
	}

	//
}
