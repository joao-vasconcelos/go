'use client';

/* * */

import ListFooter from '@/components/ListFooter/ListFooter';
import { usePlansContext } from '@/contexts/PlansContext';
import { useTranslations } from 'next-intl';

/* * */

export function PlansListFooter() {
	//

	//
	// A. Setup variables

	const t = useTranslations('PlansListFooter');
	const plansContext = usePlansContext();

	//
	// B. Render components

	return <ListFooter>{t('found_items', { count: plansContext.list.items.length })}</ListFooter>;

	//
}
