'use client';

/* * */

import ListFooter from '@/components/ListFooter/ListFooter';
import { useTagsExplorerContext } from '@/contexts/TagsExplorerContext';
import { useTranslations } from 'next-intl';

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
