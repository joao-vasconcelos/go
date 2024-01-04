'use client';

import useSWR from 'swr';
import styles from './PatternCard.module.css';
import { useTranslations } from 'next-intl';
import { IconChevronRight } from '@tabler/icons-react';
import Text from '@/components/Text/Text';
import Loader from '@/components/Loader/Loader';

export default function PatternCard({ _id, onClick }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('patterns');

  //
  // B. Fetch data

  const { data: patternData } = useSWR(_id && `/api/patterns/${_id}`);

  //
  // E. Render components

  return patternData ? (
    <div className={styles.container} onClick={() => onClick(_id)}>
      <div className={styles.routeInfo}>
        <Text size='subtitle' style='muted'>
          {patternData.code || '...'}
        </Text>
        <Text size='title' style={!patternData.headsign && 'untitled'}>
          {patternData.headsign ? patternData.headsign : t('untitled')}
        </Text>
      </div>
      <IconChevronRight size='20px' />
    </div>
  ) : (
    <div className={styles.loading}>
      <Loader visible />
    </div>
  );

  //
}
