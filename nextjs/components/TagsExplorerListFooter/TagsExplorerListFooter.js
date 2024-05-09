'use client';

/* * */

import { useTranslations } from 'next-intl';
import { useTagsExplorerContext } from '@/contexts/TagsExplorerContext';
import ListFooter from '@/components/ListFooter/ListFooter';

/* * */

export default function TagsExplorerListFooter() {
	//

	//
	// A. Setup variables

	const t = useTranslations('TagsExplorerListFooter');
	const tagsExplorerContext = useTagsExplorerContext();

	//
	// B. Render components

	return <ListFooter>{t('found_items', { count: tagsExplorerContext.list.items.length })}</ListFooter>;

	//
}