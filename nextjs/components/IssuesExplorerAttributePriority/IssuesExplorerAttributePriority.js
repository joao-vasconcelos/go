'use client';

/* * */

import { useTranslations } from 'next-intl';
import { IconUrgent, IconFlag, IconFlare } from '@tabler/icons-react';
import styles from './IssuesExplorerAttributePriority.module.css';

/* * */

export default function IssuesExplorerAttributePriority({ priority }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('IssuesExplorerAttributePriority');

  //
  // B. Render components

  switch (priority) {
    case 'urgent':
      return (
        <div className={`${styles.container} ${styles.urgent}`}>
          <IconUrgent size={14} />
          <p className={styles.label}>{t(`${priority}.label`)}</p>
        </div>
      );
    case 'important':
      return (
        <div className={`${styles.container} ${styles.important}`}>
          <IconFlag size={14} />
          <p className={styles.label}>{t(`${priority}.label`)}</p>
        </div>
      );
    case 'moderate':
      return (
        <div className={`${styles.container} ${styles.moderate}`}>
          <IconFlare size={14} />
          <p className={styles.label}>{t(`${priority}.label`)}</p>
        </div>
      );
  }

  //
}
