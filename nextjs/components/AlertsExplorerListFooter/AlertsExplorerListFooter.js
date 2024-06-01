'use client';

/* * */

import ListFooter from '@/components/ListFooter/ListFooter';
import { useAlertsExplorerContext } from '@/contexts/AlertsExplorerContext';
import { useTranslations } from 'next-intl';

/* * */

export default function AlertsExplorerListFooter() {
	//

	//
	// A. Setup variables

	const t = useTranslations('AlertsExplorerListFooter');
	const alertsExplorerContext = useAlertsExplorerContext();

	//
	// B. Render components

	return <ListFooter>{t('found_items', { count: alertsExplorerContext.list.items.length })}</ListFooter>;

	//
}
