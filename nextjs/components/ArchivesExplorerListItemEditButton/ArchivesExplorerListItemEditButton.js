'use client';

/* * */

import { useArchivesExplorerItemContext } from '@/contexts/ArchivesExplorerItemContext';
import { Button } from '@mantine/core';
import { IconPencil } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

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
			<Button leftSection={<IconPencil size={16} />} loading={archivesExplorerItemContext.item.is_saving} onClick={archivesExplorerItemContext.toggleEditMode} size="xs" variant="light">
				{t('edit.label')}
			</Button>
		</div>
	);

	//
}
