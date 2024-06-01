'use client';

/* * */

import ListFooter from '@/components/ListFooter/ListFooter';
import { useIssuesExplorerContext } from '@/contexts/IssuesExplorerContext';
import { useTranslations } from 'next-intl';

/* * */

export default function IssuesExplorerListFooter() {
	//

	//
	// A. Setup variables

	const t = useTranslations('IssuesExplorerListFooter');
	const issuesExplorerContext = useIssuesExplorerContext();

	//
	// B. Render components

	return <ListFooter>{t('found_items', { count: issuesExplorerContext.list.items.length })}</ListFooter>;

	//
}
