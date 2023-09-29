'use client';

import useSWR from 'swr';
import styles from './CalendarPatternsViewAsLine.module.css';
import Link from 'next/link';

export default function CalendarPatternsViewAsLine({ patternData }) {
  //

  //
  // A. Fetch data

  const { data: routeData } = useSWR(patternData && `/api/routes/${patternData.parent_route}`);

  //
  // B. Render components

  return (
    routeData &&
    patternData && (
      <Link className={styles.container} href={`/dashboard/lines/${routeData?.parent_line}/${patternData.parent_route}/${patternData._id}`} target="_blank">
        {patternData.code} -› {patternData.headsign}
      </Link>
    )
  );
}
