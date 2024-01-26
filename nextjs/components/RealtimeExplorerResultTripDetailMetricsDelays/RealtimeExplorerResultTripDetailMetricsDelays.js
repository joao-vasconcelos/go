'use client';

/* * */

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { NumberFormatter, SimpleGrid } from '@mantine/core';
import StatCard from '@/components/StatCard/StatCard';
import Standout from '@/components/Standout/Standout';
import { useRealtimeExplorerContext } from '@/contexts/RealtimeExplorerContext';

/* * */

export default function RealtimeExplorerResultTripDetailMetricsDelays() {
  //

  //
  // A. Setup variables

  const realtimeExplorerContext = useRealtimeExplorerContext();
  const t = useTranslations('RealtimeExplorerResultTripDetailMetricsDelays');

  //
  // C. Transform data

  const averageEventDelays = useMemo(() => {
    // Init variables to hold total delays
    let accumulatedDelayFromVehicleToInsert = 0;
    let accumulatedDelayFromVehicleToHeader = 0;
    let accumulatedDelayFromHeaderToInsert = 0;
    // Get the total amount of events for this trip
    const totalEvents = realtimeExplorerContext.selectedTrip.positions.length;
    // Iterate on each event to calculate the delay between timestamps
    realtimeExplorerContext.selectedTrip.positions.forEach((event) => {
      // Calculate the delay between vehicle and inser
      accumulatedDelayFromVehicleToInsert += event.insert_timestamp - event.vehicle_timestamp * 1000;
      accumulatedDelayFromVehicleToHeader += Number(event.header_timestamp) * 1000 - event.vehicle_timestamp * 1000;
      accumulatedDelayFromHeaderToInsert += event.insert_timestamp - Number(event.header_timestamp) * 1000;
    });
    // Calculate the average delays
    return {
      avg_delay_from_vehicle_to_insert: accumulatedDelayFromVehicleToInsert / totalEvents / 1000, // in seconds
      avg_delay_from_vehicle_to_header: accumulatedDelayFromVehicleToHeader / totalEvents / 1000, // in seconds
      avg_delay_from_header_to_insert: accumulatedDelayFromHeaderToInsert / totalEvents / 1000, // in seconds
    };
    //
  }, [realtimeExplorerContext.selectedTrip.positions]);

  //
  // D. Render components

  return (
    <Standout title={t('title')} description={t('description')} collapsible defaultOpen={true}>
      <SimpleGrid cols={3}>
        <StatCard
          title={t('metrics.avg_delay_from_vehicle_to_insert.title')}
          value={averageEventDelays.avg_delay_from_vehicle_to_insert}
          displayValue={averageEventDelays.avg_delay_from_vehicle_to_insert >= 1 ? <NumberFormatter value={averageEventDelays.avg_delay_from_vehicle_to_insert} suffix=" segundos" decimalScale={0} /> : '< 1 segundo'}
        />
        <StatCard
          title={t('metrics.avg_delay_from_vehicle_to_header.title')}
          value={averageEventDelays.avg_delay_from_vehicle_to_header}
          displayValue={averageEventDelays.avg_delay_from_vehicle_to_header >= 1 ? <NumberFormatter value={averageEventDelays.avg_delay_from_vehicle_to_header} suffix=" segundos" decimalScale={0} /> : '< 1 segundo'}
        />
        <StatCard
          title={t('metrics.avg_delay_from_header_to_insert.title')}
          value={averageEventDelays.avg_delay_from_header_to_insert}
          displayValue={averageEventDelays.avg_delay_from_header_to_insert >= 1 ? <NumberFormatter value={averageEventDelays.avg_delay_from_header_to_insert} suffix=" segundos" decimalScale={0} /> : '< 1 segundo'}
        />
      </SimpleGrid>
    </Standout>
  );

  //
}
