'use client';

/* * */

import { useTranslations } from 'next-intl';
import { IconPencil, IconBroadcast, IconBolt, IconHandStop, IconDiscountCheck } from '@tabler/icons-react';
import styles from './IssuesExplorerAttributeStatus.module.css';

/* * */

export default function IssuesExplorerAttributeStatus({ status }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('IssuesExplorerAttributeStatus');

  //
  // B. Render components

  switch (status) {
    case 'draft':
      return (
        <div className={`${styles.container} ${styles.draft}`}>
          <IconPencil size={14} />
          <p className={styles.label}>{t(`${status}.label`)}</p>
        </div>
      );
    case 'open':
      return (
        <div className={`${styles.container} ${styles.open}`}>
          <IconBroadcast size={14} />
          <p className={styles.label}>{t(`${status}.label`)}</p>
        </div>
      );
    case 'in_progress':
      return (
        <div className={`${styles.container} ${styles.inProgress}`}>
          <IconBolt size={14} />
          <p className={styles.label}>{t(`${status}.label`)}</p>
        </div>
      );
    case 'blocked':
      return (
        <div className={`${styles.container} ${styles.blocked}`}>
          <IconHandStop size={14} />
          <p className={styles.label}>{t(`${status}.label`)}</p>
        </div>
      );
    case 'closed':
      return (
        <div className={`${styles.container} ${styles.closed}`}>
          <IconDiscountCheck size={14} />
          <p className={styles.label}>{t(`${status}.label`)}</p>
        </div>
      );
  }

  //
}
