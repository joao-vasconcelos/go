'use client';

import useSWR from 'swr';
import styles from './SchedulesTable.module.css';
import { ActionIcon, Flex, MultiSelect, Button } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import { IconTrash } from '@tabler/icons-react';

export default function SchedulesTable({ form, onDelete }) {
  //

  // Fetch calendars
  const { data: allCalendarsData } = useSWR('/api/calendars');

  //
  // Render components

  const StopSequenceHeader = () => (
    <div className={styles.tableHeaderRow}>
      <div className={styles.tableHeaderCell}>Hora de Início</div>
      <div className={styles.tableHeaderCell}>Calendários ON</div>
      <div className={styles.tableHeaderCell}>Calendários OFF</div>
      <div className={styles.tableHeaderCell} />
      <div className={styles.tableHeaderCell} />
    </div>
  );

  const StopSequenceFooter = () => (
    <div className={styles.tableHeaderRow}>
      <div className={styles.tableHeaderCell} />
      <div className={styles.tableHeaderCell} />
      <div className={styles.tableHeaderCell} />
      <div className={styles.tableHeaderCell} />
    </div>
  );

  return (
    <div className={styles.container}>
      <StopSequenceHeader />
      <div className={styles.rowWrapper}>
        {form.values.schedules.length > 0 ? (
          form.values.schedules.map((item, index) => (
            <div className={styles.tableBodyRow} key={index}>
              <div className={`${styles.tableBodyCell} ${styles.hcenter}`}>
                <TimeInput withSeconds aria-label='star_time' {...form.getInputProps(`schedules.${index}.start_time`)} w={'100%'} />
              </div>
              <div className={styles.tableBodyCell}>
                <MultiSelect
                  aria-label='Calendário'
                  placeholder='Calendário'
                  searchable
                  nothingFound='Sem opções'
                  w={'100%'}
                  {...form.getInputProps(`schedules.${index}.calendars_on`)}
                  data={
                    allCalendarsData
                      ? allCalendarsData.map((calendar) => {
                          return { value: calendar._id, label: `[${calendar.code}] ${calendar.name || '-'}`, disabled: form.values.schedules[index].calendars_off.includes(calendar._id) };
                        })
                      : []
                  }
                />
              </div>
              <div className={styles.tableBodyCell}>
                <MultiSelect
                  aria-label='Calendário'
                  placeholder='Calendário'
                  searchable
                  nothingFound='Sem opções'
                  w={'100%'}
                  {...form.getInputProps(`schedules.${index}.calendars_off`)}
                  data={
                    allCalendarsData
                      ? allCalendarsData.map((calendar) => {
                          return { value: calendar._id, label: `[${calendar.code}] ${calendar.name || '-'}`, disabled: form.values.schedules[index].calendars_on.includes(calendar._id) };
                        })
                      : []
                  }
                />
              </div>
              <div className={`${styles.tableBodyCell} ${styles.hcenter}`}>
                <Button size='xs' disabled>
                  Ajustes
                </Button>
              </div>
              <div className={`${styles.tableBodyCell} ${styles.hcenter}`}>
                <Flex>
                  <ActionIcon size='lg' color='red' onClick={() => onDelete(index)}>
                    <IconTrash size='20px' />
                  </ActionIcon>
                </Flex>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.tableRow}>
            <div className={styles.rowWrapper}>
              <div className={styles.tableBodyCell}>Nenhuma Linha Selecionada</div>
            </div>
          </div>
        )}
      </div>
      <StopSequenceFooter />
    </div>
  );

  //
}
