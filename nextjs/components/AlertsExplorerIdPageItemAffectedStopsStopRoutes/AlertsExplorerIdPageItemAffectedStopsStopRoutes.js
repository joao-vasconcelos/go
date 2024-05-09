'use client';

/* * */

import useSWR from 'swr';
import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { MultiSelect, SimpleGrid } from '@mantine/core';
import { useAlertsExplorerContext } from '@/contexts/AlertsExplorerContext';
import Standout from '@/components/Standout/Standout';

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
		const thisStop = allLiveStopsData.find((item) => item.id === alertsExplorerContext.form.values.affected_stops[affectedStopIndex].stop_id);
		return allLiveRoutesData
			.filter((item) => {
				const stopRoutes = new Set(thisStop.routes);
				return stopRoutes.has(item.id);
			})
			.map((item) => {
				return { value: item.id, label: `[${item.id}] ${item.long_name}` };
			});
	}, [affectedStopIndex, alertsExplorerContext.form.values.affected_stops, allLiveRoutesData, allLiveStopsData]);

	//
	// D. Render components

	return (
		<SimpleGrid>
			<Standout title={t('form.route_stops.label')}>
				<MultiSelect
					placeholder={t('form.route_stops.placeholder')}
					nothingFoundMessage={t('form.route_stops.nothingFound')}
					{...alertsExplorerContext.form.getInputProps(`affected_stops.${affectedStopIndex}.specific_routes`)}
					limit={100}
					data={availableLiveRouteStops}
					readOnly={alertsExplorerContext.page.is_read_only}
					disabled={!alertsExplorerContext.form.values.affected_stops[affectedStopIndex].stop_id}
					searchable
					clearable
					w="100%"
				/>
			</Standout>
		</SimpleGrid>
	);

	//
}