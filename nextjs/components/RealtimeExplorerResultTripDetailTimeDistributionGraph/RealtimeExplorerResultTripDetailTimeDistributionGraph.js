'use client';

/* * */

import { useMemo } from 'react';
import { Select } from '@mantine/core';
import { LineChart } from '@mantine/charts';
import { Section } from '@/components/Layouts/Layouts';
import { useRealtimeExplorerContext } from '@/contexts/RealtimeExplorerContext';

/* * */

function unixSecondsToMilliseconds(seconds) {
  return Number(seconds) * 1000;
}

function formatTime(time) {
  return new Date(time).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function RealtimeExplorerResultTripDetailTimeDistributionGraph() {
  //

  //
  // A. Setup variables

  const realtimeExplorerContext = useRealtimeExplorerContext();
  //   const t = useTranslations('RealtimeExplorerResultTripDetailTimeDistributionGraph');

  //
  // C. Transform data

  const allTripEventsChartData = useMemo(() => {
    // Initiate a new variable
    const chartData = {};
    // Iterate through all trip positions
    realtimeExplorerContext.selectedTrip.positions.forEach((event) => {
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
    // Convert chartData object to desired format
    return Object.keys(chartData).map((key) => ({
      timeframe: formatTime(parseInt(key)),
      insert_timestamp: chartData[key].insert_timestamp,
      header_timestamp: chartData[key].header_timestamp,
      vehicle_timestamp: chartData[key].vehicle_timestamp,
    }));
    //
  }, [realtimeExplorerContext.form.time_distribution_graph_timeframe, realtimeExplorerContext.selectedTrip.positions]);

  //
  // D. Render components

  return (
    <Section>
      <Select
        data={[
          { label: '30 segundos', value: '30' },
          { label: '1 minuto', value: '60' },
          { label: '2 minutos', value: '120' },
          { label: '5 minutos', value: '300' },
        ]}
        onChange={realtimeExplorerContext.updateTimeDistributionGraphTimeframe}
        value={realtimeExplorerContext.form.time_distribution_graph_timeframe}
        style={{ alignSelf: 'flex-end' }}
      />
      <LineChart
        h={200}
        curveType="linear"
        connectNulls={false}
        tooltipAnimationDuration={200}
        data={allTripEventsChartData}
        withLegend
        dataKey="timeframe"
        series={[
          { name: 'insert_timestamp', color: 'orange' },
          { name: 'header_timestamp', color: 'blue' },
          { name: 'vehicle_timestamp', color: 'red' },
        ]}
        yAxisProps={{ domain: [0, 6] }}
        tickLine="xy"
      />
    </Section>
  );

  //
}
