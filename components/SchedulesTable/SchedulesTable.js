'use client';

import useSWR from 'swr';
import { useTranslations } from 'next-intl';
import styles from './SchedulesTable.module.css';
import { usePatternFormContext } from '@/contexts/patternForm';
import { ActionIcon, Flex, MultiSelect, Button } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import { IconTrash } from '@tabler/icons-react';
import SchedulesTableRow from '../SchedulesTableRow/SchedulesTableRow';

export default function SchedulesTable({ onDelete }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('SchedulesTable');
  const patternForm = usePatternFormContext();

  // B. Fetch data

  const { data: allCalendarsData } = useSWR('/api/calendars');

  //
  // Render components

  const TableHeader = () => (
    <div className={styles.tableHeaderRow}>
      <div className={styles.tableHeaderCell}>Hora de Início</div>
      <div className={styles.tableHeaderCell}>Calendários ON</div>
      <div className={styles.tableHeaderCell}>Calendários OFF</div>
      <div className={styles.tableHeaderCell} />
    </div>
  );

  return (
    <div className={styles.container}>
      <TableHeader />
      <div className={styles.rowWrapper}>
        {patternForm.values.schedules.length > 0 ? (
          patternForm.values.schedules.map((item, index) => <SchedulesTableRow key={index} rowIndex={index} onRemove={onDelete} />)
        ) : (
          <div className={styles.tableRow}>
            <div className={styles.rowWrapper}>
              <div className={styles.tableBodyCell}>Nenhuma Linha Selecionada</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  //
}
