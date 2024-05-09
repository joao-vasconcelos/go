'use client';

/* * */

import { useTranslations } from 'next-intl';
import { useArchivesExplorerContext } from '@/contexts/ArchivesExplorerContext';
import ListFooter from '@/components/ListFooter/ListFooter';

/* * */

export default function ArchivesExplorerListFooter() {
	//

	//
	// A. Setup variables

	const t = useTranslations('ArchivesExplorerListFooter');
	const archivesExplorerContext = useArchivesExplorerContext();

	//
	// B. Render components

	return <ListFooter>{t('found_items', { count: archivesExplorerContext.list.items.length })}</ListFooter>;

	//
}