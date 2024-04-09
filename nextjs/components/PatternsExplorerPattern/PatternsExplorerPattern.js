'use client';

/* * */

import useSWR from 'swr';
import styles from './PatternsExplorerPattern.module.css';
import { useTranslations } from 'next-intl';
import { IconChevronRight } from '@tabler/icons-react';
import Text from '@/components/Text/Text';
import { useRouter } from '@/translations/navigation';
import Loader from '@/components/Loader/Loader';

/* * */

export default function PatternsExplorerPattern({ patternId, openInNewTab = false }) {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const t = useTranslations('PatternsExplorerPattern');

  //
  // B. Fetch data

  const { data: patternData } = useSWR(patternId && `/api/patterns/${patternId}`);
  const { data: routeData } = useSWR(patternData?.parent_route && `/api/routes/${patternData?.parent_route}`);

  //
  // C. Handle actions

  const handleClick = () => {
    const url = `/lines/${routeData?.parent_line}/${routeData._id}/${patternId}`;
    if (openInNewTab) window.open(url, '_blank');
    else router.push(url);
  };

  //
  // D. Render components

  return patternData ? (
    <div className={styles.container} onClick={handleClick}>
      <div className={styles.routeInfo}>
        <Text size="subtitle" style="muted">
          {patternData.code || '...'}
        </Text>
        <Text size="title" style={!patternData.headsign && 'untitled'}>
          {patternData.headsign ? patternData.headsign : t('untitled')}
        </Text>
      </div>
      <IconChevronRight size="20px" />
    </div>
  ) : (
    <div className={styles.loading}>
      <Loader visible />
    </div>
  );

  //
}
