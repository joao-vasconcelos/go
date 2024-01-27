'use client';

/* * */

import { useMemo } from 'react';
import { Section } from '@/components/Layouts/Layouts';
import { BarChart, LineChart } from '@mantine/charts';
import { SegmentedControl, Select, SimpleGrid } from '@mantine/core';
import { useRealtimeExplorerContext } from '@/contexts/RealtimeExplorerContext';

/* * */

function unixSecondsToMilliseconds(seconds) {
  return Number(seconds) * 1000;
}

function formatTime(time) {
  return new Date(time).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function RealtimeExplorerResultTripDetailChartsTimestampsDistribution() {
  //

  //
  // A. Setup variables

  const realtimeExplorerContext = useRealtimeExplorerContext();

  //
  // C. Transform data

  const allTripEventsChartData = useMemo(() => {
    // Initiate a new variable
    const chartData = {};
    // Iterate through all trip positions
    const sortedPositions = realtimeExplorerContext.selectedTrip.positions.sort((a, b) => Number(a[realtimeExplorerContext.form.event_order_type]) - Number(b[realtimeExplorerContext.form.event_order_type]));
    const clippedPositions = sortedPositions.slice(0, realtimeExplorerContext.selectedTrip.event_animation_index);
    // Iterate through all trip positions
    clippedPositions.forEach((event) => {
      // Isolate the timestamp variables
      const insertTimestamp = event.insert_timestamp; // Already in milliseconds
      const headerTimestamp = unixSecondsToMilliseconds(event.vehicle_timestamp);
      const vehicleTimestamp = unixSecondsToMilliseconds(event.header_timestamp);
      // Calculate the start time of the 5-minute interval
      const insertStartTime = insertTimestamp - (insertTimestamp % (realtimeExplorerContext.form.time_distribution_graph_timeframe * 1000));
      const headerStartTime = headerTimestamp - (headerTimestamp % (realtimeExplorerContext.form.time_distribution_graph_timeframe * 1000));
      const vehicleStartTime = vehicleTimestamp - (vehicleTimestamp % (realtimeExplorerContext.form.time_distribution_graph_timeframe * 1000));
      // Create count objects if they do not exist yet
      if (!chartData[insertStartTime]) chartData[insertStartTime] = { insert_timestamp: 0, header_timestamp: 0, vehicle_timestamp: 0 };
      if (!chartData[headerStartTime]) chartData[headerStartTime] = { insert_timestamp: 0, header_timestamp: 0, vehicle_timestamp: 0 };
      if (!chartData[vehicleStartTime]) chartData[vehicleStartTime] = { insert_timestamp: 0, header_timestamp: 0, vehicle_timestamp: 0 };
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
    for (let i = minTimestamp; i <= maxTimestamp; i += realtimeExplorerContext.form.time_distribution_graph_timeframe * 1000) {
      dataPoints.push({
        timeframe: formatTime(i),
        insert_timestamp: chartData[String(i)]?.insert_timestamp,
        header_timestamp: chartData[String(i)]?.header_timestamp,
        vehicle_timestamp: chartData[String(i)]?.vehicle_timestamp,
      });
    }
    // Return result
    return dataPoints;
    //
  }, [realtimeExplorerContext.form.event_order_type, realtimeExplorerContext.form.time_distribution_graph_timeframe, realtimeExplorerContext.selectedTrip.event_animation_index, realtimeExplorerContext.selectedTrip.positions]);

  //
  // D. Render components

  return (
    <Section>
      <SimpleGrid cols={2} style={{ alignSelf: 'flex-end', alignItems: 'center' }}>
        <SegmentedControl
          data={[
            { label: 'Linhas', value: 'line' },
            { label: 'Barras', value: 'bar' },
          ]}
          onChange={realtimeExplorerContext.updateTimeDistributionGraphType}
          value={realtimeExplorerContext.form.time_distribution_graph_type}
          size="xs"
        />
        <Select
          data={[
            { label: '30 segundos', value: '30' },
            { label: '1 minuto', value: '60' },
            { label: '2 minutos', value: '120' },
            { label: '5 minutos', value: '300' },
          ]}
          onChange={realtimeExplorerContext.updateTimeDistributionGraphTimeframe}
          value={realtimeExplorerContext.form.time_distribution_graph_timeframe}
          allowDeselect={false}
          size="xs"
        />
      </SimpleGrid>
      <SimpleGrid>
        {realtimeExplorerContext.form.time_distribution_graph_type === 'line' && (
          <LineChart
            h={200}
            curveType="linear"
            connectNulls={false}
            tooltipAnimationDuration={200}
            data={allTripEventsChartData}
            withLegend
            dataKey="timeframe"
            series={[
              { name: 'insert_timestamp', label: 'Hora Recebida', color: 'orange' },
              { name: 'header_timestamp', label: 'Hora do Operador', color: 'blue' },
              { name: 'vehicle_timestamp', label: 'Hora do Veículo', color: 'red' },
            ]}
            yAxisProps={{ domain: [0, 6] }}
            tickLine="xy"
          />
        )}
        {realtimeExplorerContext.form.time_distribution_graph_type === 'bar' && (
          <BarChart
            h={200}
            tooltipAnimationDuration={200}
            data={allTripEventsChartData}
            withLegend
            dataKey="timeframe"
            series={[
              { name: 'insert_timestamp', label: 'Hora Recebida', color: 'orange' },
              { name: 'header_timestamp', label: 'Hora do Operador', color: 'blue' },
              { name: 'vehicle_timestamp', label: 'Hora do Veículo', color: 'red' },
            ]}
            yAxisProps={{ domain: [0, 6] }}
            tickLine="xy"
          />
        )}
      </SimpleGrid>
    </Section>
  );

  //
}
