'use client';

/* * */

import ListFooter from '@/components/ListFooter/ListFooter';
import { useMediaExplorerContext } from '@/contexts/MediaExplorerContext';
import { useTranslations } from 'next-intl';

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
