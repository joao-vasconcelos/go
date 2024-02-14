'use client';

/* * */

import useSWR from 'swr';
import styles from './LinesExplorerLine.module.css';
import Loader from '@/components/Loader/Loader';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

/* * */

export function LinesExplorerLine({ lineId, withBadge = true }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('LinesExplorerLine');
  const router = useRouter();

  //
  // B. Fetch data

  const { data: lineData } = useSWR(lineId && `/api/lines/${lineId}`);
  const { data: typologyData } = useSWR(lineData?.typology && `/api/typologies/${lineData.typology}`);

  //
  // C. Handle actions

  const handleOpenLine = () => {
    window.open(`/lines/${lineId}`, '_blank');
  };

  //
  // D. Render components

  return lineData && typologyData ? (
    <div className={styles.container} onClick={handleOpenLine}>
      {withBadge && (
        <div className={styles.badge} style={{ backgroundColor: typologyData.color, color: typologyData.text_color }}>
          {lineData.short_name || t('untitled')}
        </div>
      )}
      <div className={styles.name}>{lineData.name}</div>
    </div>
  ) : (
    <Loader size={10} visible />
  );

  //
}
