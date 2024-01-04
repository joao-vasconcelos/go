'use client';

import useSWR from 'swr';
import styles from './RouteCard.module.css';
import { useTranslations } from 'next-intl';
import { IconChevronRight } from '@tabler/icons-react';
import Text from '@/components/Text/Text';
import Loader from '@/components/Loader/Loader';

export default function RouteCard({ _id, onClick }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('routes');

  //
  // B. Fetch data

  const { data: routeData } = useSWR(_id && `/api/routes/${_id}`);

  //
  // E. Render components

  return routeData ? (
    <div className={styles.container} onClick={() => onClick(_id)}>
      <div className={styles.routeInfo}>
        <Text size='subtitle' style='muted'>
          {routeData.code || '...'}
        </Text>
        <Text size='title' style={!routeData.name && 'untitled'}>
          {routeData.name ? routeData.name : t('untitled')}
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
