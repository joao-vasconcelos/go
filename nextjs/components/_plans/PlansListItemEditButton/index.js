'use client';

/* * */

import { usePlansItemContext } from '@/contexts/PlansItemContext';
import { Button } from '@mantine/core';
import { IconPencil } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import styles from './styles.module.css';

/* * */

export function PlansListItemEditButton() {
	//

	//
	// A. Setup variables

	const t = useTranslations('PlansListItemEditButton');
	const plansItemContext = usePlansItemContext();

	//
	// B. Render components

	return (
		<div className={styles.container}>
			<Button leftSection={<IconPencil size={16} />} loading={plansItemContext.item.is_saving} onClick={plansItemContext.toggleEditMode} size="xs" variant="light">
				{t('edit.label')}
			</Button>
		</div>
	);

	//
}
