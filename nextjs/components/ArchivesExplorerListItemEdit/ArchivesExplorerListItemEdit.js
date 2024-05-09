'use client';

/* * */

import { useArchivesExplorerItemContext } from '@/contexts/ArchivesExplorerItemContext';
import ArchivesExplorerListItemEditForm from '@/components/ArchivesExplorerListItemEditForm/ArchivesExplorerListItemEditForm';
import ArchivesExplorerListItemEditButton from '@/components/ArchivesExplorerListItemEditButton/ArchivesExplorerListItemEditButton';
import styles from './ArchivesExplorerListItemEdit.module.css';

/* * */

export default function ArchivesExplorerListItemEdit() {
	//

	//
	// A. Setup variables

	const archivesExplorerItemContext = useArchivesExplorerItemContext();

	//
	// B. Render components

	return <div className={styles.container}>{archivesExplorerItemContext.item.is_edit_mode ? <ArchivesExplorerListItemEditForm /> : <ArchivesExplorerListItemEditButton />}</div>;

	//
}