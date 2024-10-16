'use client';

/* * */

import { Section } from '@/components/Layouts/Layouts';
import StatCard from '@/components/StatCard/StatCard';
import { useReportsExplorerRealtimeContext } from '@/contexts/ReportsExplorerRealtimeContext';
import { SimpleGrid } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

/* * */

export default function ReportsExplorerRealtimeResultSummaryMetrics() {
	//

	//
	// A. Setup variables

	const t = useTranslations('ReportsExplorerRealtimeResultSummaryMetrics');
	const reportsExplorerRealtimeContext = useReportsExplorerRealtimeContext();

	//
	// B. Transform data

	const totalEventsMetricData = useMemo(() => {
		// Return zero if no trips are yet available
		if (!reportsExplorerRealtimeContext.request.summary) return 0;
		// Setup a new variable to hold the count total
		let eventsCount = 0;
		// Count the events for each trip
		reportsExplorerRealtimeContext.request.summary.forEach(trip => eventsCount += trip.positions.length);
		// Return the result
		return eventsCount;
		//
	}, [reportsExplorerRealtimeContext.request.summary]);

	//
	// C. Render components

	return (
		<Section>
			<SimpleGrid cols={2}>
				<StatCard displayValue={totalEventsMetricData} title={t('total_events.title')} value={totalEventsMetricData} />
				<StatCard displayValue={reportsExplorerRealtimeContext.request.summary.length} title={t('total_trips.title')} value={reportsExplorerRealtimeContext.request.summary.length} />
			</SimpleGrid>
		</Section>
	);

	//
}
