'use client';

/* * */

import Standout from '@/components/Standout/Standout';
import { useAlertsExplorerContext } from '@/contexts/AlertsExplorerContext';
import { MultiSelect, SimpleGrid } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import useSWR from 'swr';

/* * */

export default function AlertsExplorerIdPageItemAffectedStopsStopRoutes({ affectedStopIndex }) {
	//

	//
	// A. Setup variables

	const t = useTranslations('AlertsExplorerIdPageItemAffectedStopsStopRoutes');
	const alertsExplorerContext = useAlertsExplorerContext();

	//
	// B. Fetch data

	const { data: allLiveStopsData } = useSWR('https://api.carrismetropolitana.pt/stops');
	const { data: allLiveRoutesData } = useSWR('https://api.carrismetropolitana.pt/routes');

	//
	// C. Transform data

	const availableLiveRouteStops = useMemo(() => {
		if (!allLiveStopsData || !allLiveRoutesData || !alertsExplorerContext.form.values.affected_stops[affectedStopIndex].stop_id) return [];
		const thisStop = allLiveStopsData.find(item => item.id === alertsExplorerContext.form.values.affected_stops[affectedStopIndex].stop_id);
		return allLiveRoutesData
			.filter((item) => {
				const stopRoutes = new Set(thisStop.routes);
				return stopRoutes.has(item.id);
			})
			.map((item) => {
				return { label: `[${item.id}] ${item.long_name}`, value: item.id };
			});
	}, [affectedStopIndex, alertsExplorerContext.form.values.affected_stops, allLiveRoutesData, allLiveStopsData]);

	//
	// D. Render components

	return (
		<SimpleGrid>
			<Standout title={t('form.route_stops.label')}>
				<MultiSelect
					nothingFoundMessage={t('form.route_stops.nothingFound')}
					placeholder={t('form.route_stops.placeholder')}
					{...alertsExplorerContext.form.getInputProps(`affected_stops.${affectedStopIndex}.specific_routes`)}
					data={availableLiveRouteStops}
					disabled={!alertsExplorerContext.form.values.affected_stops[affectedStopIndex].stop_id}
					limit={100}
					readOnly={alertsExplorerContext.page.is_read_only}
					w="100%"
					clearable
					searchable
				/>
			</Standout>
		</SimpleGrid>
	);

	//
}
