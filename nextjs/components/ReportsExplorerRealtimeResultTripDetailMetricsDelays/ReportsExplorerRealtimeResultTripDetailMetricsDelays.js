'use client';

/* * */

import Standout from '@/components/Standout/Standout';
import StatCard from '@/components/StatCard/StatCard';
import { useReportsExplorerRealtimeContext } from '@/contexts/ReportsExplorerRealtimeContext';
import { NumberFormatter, SimpleGrid } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

/* * */

export default function ReportsExplorerRealtimeResultTripDetailMetricsDelays() {
	//

	//
	// A. Setup variables

	const reportsExplorerRealtimeContext = useReportsExplorerRealtimeContext();
	const t = useTranslations('ReportsExplorerRealtimeResultTripDetailMetricsDelays');

	//
	// C. Transform data

	const averageEventDelays = useMemo(() => {
		// Init variables to hold total delays
		let accumulatedDelayFromVehicleToInsert = 0;
		let accumulatedDelayFromVehicleToHeader = 0;
		let accumulatedDelayFromHeaderToInsert = 0;
		// Get the total amount of events for this trip
		const totalEvents = reportsExplorerRealtimeContext.selectedTrip.positions.length;
		// Iterate on each event to calculate the delay between timestamps
		reportsExplorerRealtimeContext.selectedTrip.positions.forEach((event) => {
			// Calculate the delay between vehicle and inser
			accumulatedDelayFromVehicleToInsert += event.insert_timestamp - event.vehicle_timestamp * 1000;
			accumulatedDelayFromVehicleToHeader += Number(event.header_timestamp) * 1000 - event.vehicle_timestamp * 1000;
			accumulatedDelayFromHeaderToInsert += event.insert_timestamp - Number(event.header_timestamp) * 1000;
		});
		// Calculate the average delays
		return {
			avg_delay_from_header_to_insert: accumulatedDelayFromHeaderToInsert / totalEvents / 1000, // in seconds
			avg_delay_from_vehicle_to_header: accumulatedDelayFromVehicleToHeader / totalEvents / 1000, // in seconds
			avg_delay_from_vehicle_to_insert: accumulatedDelayFromVehicleToInsert / totalEvents / 1000, // in seconds
		};
		//
	}, [reportsExplorerRealtimeContext.selectedTrip.positions]);

	//
	// D. Render components

	return (
		<Standout defaultOpen={true} description={t('description')} title={t('title')} collapsible>
			<SimpleGrid cols={3}>
				<StatCard
					displayValue={averageEventDelays.avg_delay_from_vehicle_to_insert >= 1 ? <NumberFormatter decimalScale={0} suffix=" segundos" value={averageEventDelays.avg_delay_from_vehicle_to_insert} /> : '< 1 segundo'}
					title={t('metrics.avg_delay_from_vehicle_to_insert.title')}
					value={averageEventDelays.avg_delay_from_vehicle_to_insert}
				/>
				<StatCard
					displayValue={averageEventDelays.avg_delay_from_vehicle_to_header >= 1 ? <NumberFormatter decimalScale={0} suffix=" segundos" value={averageEventDelays.avg_delay_from_vehicle_to_header} /> : '< 1 segundo'}
					title={t('metrics.avg_delay_from_vehicle_to_header.title')}
					value={averageEventDelays.avg_delay_from_vehicle_to_header}
				/>
				<StatCard
					displayValue={averageEventDelays.avg_delay_from_header_to_insert >= 1 ? <NumberFormatter decimalScale={0} suffix=" segundos" value={averageEventDelays.avg_delay_from_header_to_insert} /> : '< 1 segundo'}
					title={t('metrics.avg_delay_from_header_to_insert.title')}
					value={averageEventDelays.avg_delay_from_header_to_insert}
				/>
			</SimpleGrid>
		</Standout>
	);

	//
}
