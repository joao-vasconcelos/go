'use client';

/* * */

import Standout from '@/components/Standout/Standout';
import { useAlertsExplorerContext } from '@/contexts/AlertsExplorerContext';
import { MultiSelect, SimpleGrid } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import useSWR from 'swr';

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
				return { label: `[${item.id}] ${item.name}`, value: item.id };
			});
	}, [affectedRouteIndex, alertsExplorerContext.form.values.affected_routes, allLiveStopsData]);

	//
	// E. Render components

	return (
		<SimpleGrid>
			<Standout title={t('form.route_stops.label')}>
				<MultiSelect
					nothingFoundMessage={t('form.route_stops.nothingFound')}
					placeholder={t('form.route_stops.placeholder')}
					{...alertsExplorerContext.form.getInputProps(`affected_routes.${affectedRouteIndex}.specific_stops`)}
					data={availableLiveRouteStops}
					disabled={!alertsExplorerContext.form.values.affected_routes[affectedRouteIndex].route_id}
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
