'use client';

/* * */

import ListFooter from '@/components/ListFooter/ListFooter';
import { useFaresExplorerContext } from '@/contexts/FaresExplorerContext';
import { useTranslations } from 'next-intl';

/* * */

export default function FaresExplorerListFooter() {
	//

	//
	// A. Setup variables

	const t = useTranslations('FaresExplorerListFooter');
	const faresExplorerContext = useFaresExplorerContext();

	//
	// B. Render components

	return <ListFooter>{t('found_items', { count: faresExplorerContext.list.items.length })}</ListFooter>;

	//
}
