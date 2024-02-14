'use client';

/* * */

import useSWR from 'swr';
import { useMemo } from 'react';
import { MultiSelect } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useIssuesExplorerContext } from '@/contexts/IssuesExplorerContext';
import styles from './IssuesExplorerIdPageItemStops.module.css';

/* * */

export default function IssuesExplorerIdPageItemStops() {
  //

  //
  // A. Setup variables

  const t = useTranslations('IssuesExplorerIdPageItemStops');
  const issuesExplorerContext = useIssuesExplorerContext();

  //
  // B. Fetch data

  const { data: allStopsData } = useSWR('/api/stops');

  //
  // C. Transform data

  const allStopsDataFormatted = useMemo(() => {
    // Exit if no data is available
    if (!allStopsData) return [];
    // For each stop check if it related with the current issue or not
    return allStopsData.map((stop) => ({ value: stop._id, label: `[${stop.code}] ${stop.name}` }));
    //
  }, [allStopsData]);

  //
  // D. Render components

  return (
    <div className={styles.container}>
      <MultiSelect label={t('related_stops.label')} placeholder={t('related_stops.placeholder')} nothingFoundMessage={t('related_stops.nothingFound')} data={allStopsDataFormatted} {...issuesExplorerContext.form.getInputProps('related_stops')} limit={100} w="100%" />
    </div>
  );
}
