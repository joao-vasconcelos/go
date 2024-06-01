'use client';

/* * */

import ListFooter from '@/components/ListFooter/ListFooter';
import { useStopsExplorerContext } from '@/contexts/StopsExplorerContext';
import { useTranslations } from 'next-intl';

/* * */

export default function StopsExplorerListFooter() {
	//

	//
	// A. Setup variables

	const t = useTranslations('StopsExplorerListFooter');
	const stopsExplorerContext = useStopsExplorerContext();

	//
	// B. Render components

	return <ListFooter>{t('found_items', { count: stopsExplorerContext.list.items.length })}</ListFooter>;

	//
}
