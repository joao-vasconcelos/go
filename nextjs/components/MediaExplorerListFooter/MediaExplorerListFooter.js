'use client';

/* * */

import { useTranslations } from 'next-intl';
import { useMediaExplorerContext } from '@/contexts/MediaExplorerContext';
import ListFooter from '@/components/ListFooter/ListFooter';

/* * */

export default function MediaExplorerListFooter() {
	//

	//
	// A. Setup variables

	const t = useTranslations('MediaExplorerListFooter');
	const mediaExplorerContext = useMediaExplorerContext();

	//
	// B. Render components

	return <ListFooter>{t('found_items', { count: mediaExplorerContext.list.items.length })}</ListFooter>;

	//
}