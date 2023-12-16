'use client';

/* * */

import useSWR from 'swr';
import styles from './TestVkm.module.css';

/* * */

export default function TestVkm() {
  //

  //
  // A. Setup variables

  //
  // B. Fetch data

  const { data: agencyVkmData, isLoading: allAgenciesLoading } = useSWR('/api/agencies/644976034212abfd6e160d1a/vkm');
  console.log('agencyVkmData:', agencyVkmData);

  //
  // C. Render components

  return <div className={styles.container}>{allAgenciesLoading ? 'loading' : 'done'}</div>;

  //
}
