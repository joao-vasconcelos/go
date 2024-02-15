'use client';

/* * */

import useSWR from 'swr';
import styles from './StopsExplorerStop.module.css';
import Loader from '@/components/Loader/Loader';

/* * */

export function StopsExplorerStop({ stopId }) {
  //

  //
  // A. Fetch data

  const { data: stopData } = useSWR(stopId && `/api/stops/${stopId}`);

  //
  // B. Handle actions

  const handleOpenStop = () => {
    window.open(`/stops/${stopId}`, '_blank');
  };

  //
  // C. Render components

  return stopData ? (
    <div className={styles.container} onClick={handleOpenStop}>
      <div className={styles.badge}>#{stopData.code}</div>
      <div className={styles.name}>{stopData.name}</div>
    </div>
  ) : (
    <Loader size={10} visible />
  );

  //
}
