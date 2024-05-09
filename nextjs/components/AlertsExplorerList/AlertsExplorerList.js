'use client';

/* * */

import useSWR from 'swr';
import { useTranslations } from 'next-intl';
import Pannel from '@/components/Pannel/Pannel';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import AlertsExplorerListItem from '@/components/AlertsExplorerListItem/AlertsExplorerListItem';
import AlertsExplorerListHeader from '@/components/AlertsExplorerListHeader/AlertsExplorerListHeader';
import AlertsExplorerListFooter from '@/components/AlertsExplorerListFooter/AlertsExplorerListFooter';
import { useAlertsExplorerContext } from '@/contexts/AlertsExplorerContext';

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
		<Pannel loading={allAlertsLoading} validating={allAlertsValidating} error={allAlertsError} header={<AlertsExplorerListHeader />} footer={<AlertsExplorerListFooter />}>
			{alertsExplorerContext.list.items.length > 0 ? alertsExplorerContext.list.items.map((item) => <AlertsExplorerListItem key={item._id} item={item} />) : <NoDataLabel />}
		</Pannel>
	);

	//
}