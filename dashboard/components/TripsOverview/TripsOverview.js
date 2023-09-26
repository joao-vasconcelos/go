'use client';

import trips from './trips.json';
import styles from './TripsOverview.module.css';
import { useTranslations, useFormatter, useNow } from 'next-intl';
import Text from '../Text/Text';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

export default function TripsOverview({ last_active }) {
  //

  //
  // A. Setup variables

  //   const t = useTranslations('TripsOverview');

  const [tripsIssue, setTripsIssue] = useState(0);
  const [tripsOverview, setTripsOverview] = useState([]);

  //
  // B. Fetch data

  const { data: allTripsData } = useSWR('/api/trips/getTrips');

  //
  // C. Transform data

  useEffect(() => {
    if (!allTripsData) return;
    let counter = 0;
    for (const tripData of allTripsData) {
      if (tripData.executionStatus === 'ISSUE') counter++;
    }
    setTripsIssue(counter);
  }, [allTripsData]);

  //
  // C. Render components

  return <div>{trips?.length}</div>;

  //
}
