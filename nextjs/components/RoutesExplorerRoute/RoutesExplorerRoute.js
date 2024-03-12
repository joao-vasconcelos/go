'use client';

/* * */

import useSWR from 'swr';
import styles from './RoutesExplorerRoute.module.css';
import { useTranslations } from 'next-intl';
import { IconChevronRight } from '@tabler/icons-react';
import Text from '@/components/Text/Text';
import { useRouter } from '@/translations/navigation';
import Loader from '@/components/Loader/Loader';

/* * */

export default function RoutesExplorerRoute({ line_id, route_id }) {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const t = useTranslations('routes');

  //
  // B. Fetch data

  const { data: routeData } = useSWR(route_id && `/api/routes/${route_id}`);

  //
  // C. Handle actions

  const handleClick = () => {
    router.push(`/lines/${line_id}/${route_id}`);
  };

  //
  // D. Render components

  return routeData ? (
    <div className={styles.container} onClick={handleClick}>
      <div className={styles.routeInfo}>
        <Text size="subtitle" style="muted">
          {routeData.code || '...'}
        </Text>
        <Text size="title" style={!routeData.name && 'untitled'}>
          {routeData.name ? routeData.name : t('untitled')}
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
