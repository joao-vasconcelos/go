'use client';

/* * */

import AlertsExplorerListFooter from '@/components/AlertsExplorerListFooter/AlertsExplorerListFooter';
import AlertsExplorerListHeader from '@/components/AlertsExplorerListHeader/AlertsExplorerListHeader';
import AlertsExplorerListItem from '@/components/AlertsExplorerListItem/AlertsExplorerListItem';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import Pannel from '@/components/Pannel/Pannel';
import { useAlertsExplorerContext } from '@/contexts/AlertsExplorerContext';
import { useTranslations } from 'next-intl';
import useSWR from 'swr';

/* * */

export default function AlertsExplorerList() {
	//

	//
	// A. Setup variables

	const t = useTranslations('AlertsExplorerList');
	const alertsExplorerContext = useAlertsExplorerContext();

	//
	// B. Fetch data

	const { error: allAlertsError, isLoading: allAlertsLoading, isValidating: allAlertsValidating } = useSWR('/api/alerts');

	//
	// C. Render data

	return (
		<Pannel error={allAlertsError} footer={<AlertsExplorerListFooter />} header={<AlertsExplorerListHeader />} loading={allAlertsLoading} validating={allAlertsValidating}>
			{alertsExplorerContext.list.items.length > 0 ? alertsExplorerContext.list.items.map(item => <AlertsExplorerListItem key={item._id} item={item} />) : <NoDataLabel />}
		</Pannel>
	);

	//
}
