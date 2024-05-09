'use client';

/* * */

import { Button } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useArchivesExplorerItemContext } from '@/contexts/ArchivesExplorerItemContext';
import { IconPencil } from '@tabler/icons-react';
import styles from './ArchivesExplorerListItemEditButton.module.css';

/* * */

export default function ArchivesExplorerListItemEditButton() {
	//

	//
	// A. Setup variables

	const t = useTranslations('ArchivesExplorerListItemEditButton');
	const archivesExplorerItemContext = useArchivesExplorerItemContext();

	//
	// B. Render components

	return (
		<div className={styles.container}>
			<Button onClick={archivesExplorerItemContext.toggleEditMode} leftSection={<IconPencil size={16} />} loading={archivesExplorerItemContext.item.is_saving} size="xs" variant="light">
				{t('edit.label')}
			</Button>
		</div>
	);

	//
}