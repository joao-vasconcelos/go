'use client';

/* * */

import useSWR from 'swr';
import styles from './AssociatedPatternsViewRow.module.css';
import { Link } from '@/translations/navigation';
import Loader from '../Loader/Loader';

/* * */

export default function AssociatedPatternsViewRow({ patternData }) {
  //

  //
  // A. Fetch data

  const { data: routeData, isLoading: routeLoading } = useSWR(patternData && `/api/routes/${patternData.parent_route}`);

  //
  // B. Render components

  return (
    routeData &&
    patternData &&
    (routeLoading ? (
      <Loader size={18} visible />
    ) : (
      <Link className={styles.container} href={`/dashboard/lines/${routeData?.parent_line}/${patternData.parent_route}/${patternData._id}`} target="_blank">
        {patternData.code} -› {patternData.headsign}
      </Link>
    ))
  );

  //
}
