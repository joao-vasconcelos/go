'use client';

/* * */

import ListFooter from '@/components/ListFooter/ListFooter';
import { useUsersExplorerContext } from '@/contexts/UsersExplorerContext';
import { useTranslations } from 'next-intl';

/* * */

export default function UsersExplorerListFooter() {
	//

	//
	// A. Setup variables

	const t = useTranslations('UsersExplorerListFooter');
	const usersExplorerContext = useUsersExplorerContext();

	//
	// B. Render components

	return <ListFooter>{t('found_items', { count: usersExplorerContext.list.items.length })}</ListFooter>;

	//
}
