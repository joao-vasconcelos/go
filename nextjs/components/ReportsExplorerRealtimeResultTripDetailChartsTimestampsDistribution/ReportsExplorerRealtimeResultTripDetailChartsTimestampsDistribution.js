'use client';

/* * */

import { Section } from '@/components/Layouts/Layouts';
import { useReportsExplorerRealtimeContext } from '@/contexts/ReportsExplorerRealtimeContext';
import { BarChart, LineChart } from '@mantine/charts';
import { SegmentedControl, Select, SimpleGrid } from '@mantine/core';
import { useMemo } from 'react';

/* * */

function unixSecondsToMilliseconds(seconds) {
	return Number(seconds) * 1000;
}

function formatTime(time) {
	return new Date(time).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function ReportsExplorerRealtimeResultTripDetailChartsTimestampsDistribution() {
	//

	//
	// A. Setup variables

	const reportsExplorerRealtimeContext = useReportsExplorerRealtimeContext();

	//
	// C. Transform data

	const allTripEventsChartData = useMemo(() => {
		// Initiate a new variable
		const chartData = {};
		// Iterate through all trip positions
		const sortedPositions = reportsExplorerRealtimeContext.selectedTrip.positions.sort((a, b) => Number(a[reportsExplorerRealtimeContext.form.event_order_type]) - Number(b[reportsExplorerRealtimeContext.form.event_order_type]));
		const clippedPositions = sortedPositions.slice(0, reportsExplorerRealtimeContext.selectedTrip.event_animation_index);
		// Iterate through all trip positions
		clippedPositions.forEach((event) => {
			// Isolate the timestamp variables
			const insertTimestamp = event.insert_timestamp; // Already in milliseconds
			const headerTimestamp = unixSecondsToMilliseconds(event.vehicle_timestamp);
			const vehicleTimestamp = unixSecondsToMilliseconds(event.header_timestamp);
			// Calculate the start time of the 5-minute interval
			const insertStartTime = insertTimestamp - (insertTimestamp % (reportsExplorerRealtimeContext.form.time_distribution_graph_timeframe * 1000));
			const headerStartTime = headerTimestamp - (headerTimestamp % (reportsExplorerRealtimeContext.form.time_distribution_graph_timeframe * 1000));
			const vehicleStartTime = vehicleTimestamp - (vehicleTimestamp % (reportsExplorerRealtimeContext.form.time_distribution_graph_timeframe * 1000));
			// Create count objects if they do not exist yet
			if (!chartData[insertStartTime]) chartData[insertStartTime] = { header_timestamp: 0, insert_timestamp: 0, vehicle_timestamp: 0 };
			if (!chartData[headerStartTime]) chartData[headerStartTime] = { header_timestamp: 0, insert_timestamp: 0, vehicle_timestamp: 0 };
			if (!chartData[vehicleStartTime]) chartData[vehicleStartTime] = { header_timestamp: 0, insert_timestamp: 0, vehicle_timestamp: 0 };
			// Increase count for each timestamp
			chartData[insertStartTime].insert_timestamp = chartData[insertStartTime].insert_timestamp + 1;
			chartData[headerStartTime].header_timestamp = chartData[headerStartTime].header_timestamp + 1;
			chartData[vehicleStartTime].vehicle_timestamp = chartData[vehicleStartTime].vehicle_timestamp + 1;
		});
		// Find the first and last timestamps
		const timestamps = Object.keys(chartData).map(Number);
		const minTimestamp = Math.min(...timestamps);
		const maxTimestamp = Math.max(...timestamps);
		// Generate data points for all hours within the interval
		const dataPoints = [];
		for (let i = minTimestamp; i <= maxTimestamp; i += reportsExplorerRealtimeContext.form.time_distribution_graph_timeframe * 1000) {
			dataPoints.push({
				header_timestamp: chartData[String(i)]?.header_timestamp,
				insert_timestamp: chartData[String(i)]?.insert_timestamp,
				timeframe: formatTime(i),
				vehicle_timestamp: chartData[String(i)]?.vehicle_timestamp,
			});
		}
		// Return result
		return dataPoints;
		//
	}, [reportsExplorerRealtimeContext.form.event_order_type, reportsExplorerRealtimeContext.form.time_distribution_graph_timeframe, reportsExplorerRealtimeContext.selectedTrip.event_animation_index, reportsExplorerRealtimeContext.selectedTrip.positions]);

	//
	// D. Render components

	return (
		<Section>
			<SimpleGrid cols={2} style={{ alignItems: 'center', alignSelf: 'flex-end' }}>
				<SegmentedControl
					onChange={reportsExplorerRealtimeContext.updateTimeDistributionGraphType}
					size="xs"
					value={reportsExplorerRealtimeContext.form.time_distribution_graph_type}
					data={[
						{ label: 'Linhas', value: 'line' },
						{ label: 'Barras', value: 'bar' },
					]}
				/>
				<Select
					allowDeselect={false}
					onChange={reportsExplorerRealtimeContext.updateTimeDistributionGraphTimeframe}
					size="xs"
					value={reportsExplorerRealtimeContext.form.time_distribution_graph_timeframe}
					data={[
						{ label: '30 segundos', value: '30' },
						{ label: '1 minuto', value: '60' },
						{ label: '2 minutos', value: '120' },
						{ label: '5 minutos', value: '300' },
					]}
				/>
			</SimpleGrid>
			<SimpleGrid>
				{reportsExplorerRealtimeContext.form.time_distribution_graph_type === 'line'
				&& (
					<LineChart
						connectNulls={false}
						curveType="linear"
						data={allTripEventsChartData}
						dataKey="timeframe"
						h={200}
						tickLine="xy"
						tooltipAnimationDuration={200}
						yAxisProps={{ domain: [0, 6] }}
						series={[
							{ color: 'orange', label: 'Hora Recebida', name: 'insert_timestamp' },
							{ color: 'blue', label: 'Hora do Operador', name: 'header_timestamp' },
							{ color: 'red', label: 'Hora do Veículo', name: 'vehicle_timestamp' },
						]}
						withLegend
					/>
				)}
				{reportsExplorerRealtimeContext.form.time_distribution_graph_type === 'bar'
				&& (
					<BarChart
						data={allTripEventsChartData}
						dataKey="timeframe"
						h={200}
						tickLine="xy"
						tooltipAnimationDuration={200}
						yAxisProps={{ domain: [0, 6] }}
						series={[
							{ color: 'orange', label: 'Hora Recebida', name: 'insert_timestamp' },
							{ color: 'blue', label: 'Hora do Operador', name: 'header_timestamp' },
							{ color: 'red', label: 'Hora do Veículo', name: 'vehicle_timestamp' },
						]}
						withLegend
					/>
				)}
			</SimpleGrid>
		</Section>
	);

	//
}
