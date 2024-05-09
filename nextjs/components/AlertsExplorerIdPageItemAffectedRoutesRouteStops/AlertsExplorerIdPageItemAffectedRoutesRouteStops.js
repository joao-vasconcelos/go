'use client';

/* * */

import useSWR from 'swr';
import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { MultiSelect, SimpleGrid } from '@mantine/core';
import { useAlertsExplorerContext } from '@/contexts/AlertsExplorerContext';
import Standout from '@/components/Standout/Standout';

/* * */

export default function AlertsExplorerIdPageItemAffectedRoutesRouteStops({ affectedRouteIndex }) {
	//

	//
	// A. Setup variables

	const t = useTranslations('AlertsExplorerIdPageItemAffectedRoutesRouteStops');
	const alertsExplorerContext = useAlertsExplorerContext();

	//
	// B. Fetch data

	const { data: allLiveStopsData } = useSWR('https://api.carrismetropolitana.pt/stops');

	//
	// C. Transform data

	const availableLiveRouteStops = useMemo(() => {
		if (!allLiveStopsData || !alertsExplorerContext.form.values.affected_routes[affectedRouteIndex].route_id) return [];
		return allLiveStopsData
			.filter((item) => {
				const stopRoutes = new Set(item.routes);
				return stopRoutes.has(alertsExplorerContext.form.values.affected_routes[affectedRouteIndex].route_id);
			})
			.map((item) => {
				return { value: item.id, label: `[${item.id}] ${item.name}` };
			});
	}, [affectedRouteIndex, alertsExplorerContext.form.values.affected_routes, allLiveStopsData]);

	//
	// E. Render components

	return (
		<SimpleGrid>
			<Standout title={t('form.route_stops.label')}>
				<MultiSelect
					placeholder={t('form.route_stops.placeholder')}
					nothingFoundMessage={t('form.route_stops.nothingFound')}
					{...alertsExplorerContext.form.getInputProps(`affected_routes.${affectedRouteIndex}.specific_stops`)}
					limit={100}
					data={availableLiveRouteStops}
					readOnly={alertsExplorerContext.page.is_read_only}
					disabled={!alertsExplorerContext.form.values.affected_routes[affectedRouteIndex].route_id}
					searchable
					clearable
					w="100%"
				/>
			</Standout>
		</SimpleGrid>
	);

	//
}