'use client';

import { useTranslations } from 'next-intl';
import styles from './StopSequenceTable.module.css';
import { usePatternFormContext } from '@/contexts/patternForm';
import { Tooltip } from '@mantine/core';
import { IconSortAscendingNumbers, IconArrowBarUp, IconArrowBarToDown } from '@tabler/icons-react';
import StopSequenceTableRow from '../StopSequenceTableRow/StopSequenceTableRow';

export default function StopSequenceTable() {
  //

  //
  // A. Setup variables

  const t = useTranslations('StopSequenceTable');
  const patternForm = usePatternFormContext();

  //
  // Render components

  return (
    <div className={styles.container}>
      <div className={styles.tableHeaderRow}>
        <div className={`${styles.tableHeaderCell} ${styles.hcenter}`}>
          <Tooltip label={t('sequence_index.description')} withArrow>
            <IconSortAscendingNumbers size='20px' />
          </Tooltip>
        </div>
        <div className={styles.tableHeaderCell} style={{ paddingLeft: 20 }}>
          {t('stop.label')}
        </div>
        <div className={`${styles.tableHeaderCell} ${styles.hcenter}`}>
          <Tooltip label={t('allow_pickup.label')} withArrow>
            <IconArrowBarToDown size='20px' />
          </Tooltip>
        </div>
        <div className={`${styles.tableHeaderCell} ${styles.hcenter}`}>
          <Tooltip label={t('allow_drop_off.label')} withArrow>
            <IconArrowBarUp size='20px' />
          </Tooltip>
        </div>
        <div className={styles.tableHeaderCell}>{t('distance_delta.label')}</div>
        <div className={styles.tableHeaderCell} />
        <div className={styles.tableHeaderCell}>{t('default_velocity.label')}</div>
        <div className={styles.tableHeaderCell} />
        <div className={styles.tableHeaderCell}>{t('default_travel_time.label')}</div>
        <div className={styles.tableHeaderCell}>{t('default_dwell_time.label')}</div>
        <div className={styles.tableHeaderCell}>{t('zones.label')}</div>
      </div>
      <div className={styles.rowWrapper}>{patternForm.values.path && patternForm.values.path.map((item, index) => <StopSequenceTableRow key={index} rowIndex={index} item={item} />)}</div>
    </div>
  );

  //
}
