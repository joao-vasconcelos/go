'use client';

import useSWR from 'swr';
import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './SchedulesTable.module.css';
import { usePatternFormContext } from '@/schemas/Pattern/form';
import { PatternScheduleDefault } from '@/schemas/Pattern/default';
import AuthGate from '@/components/AuthGate/AuthGate';
import { ActionIcon, MultiSelect, Tooltip, TextInput, Button } from '@mantine/core';
import { IconClockPlay, IconCalendarCheck, IconCalendarQuestion, IconBackspace, IconCalendarX, IconPlus } from '@tabler/icons-react';
import { openConfirmModal } from '@mantine/modals';
import Text from '@/components/Text/Text';

//
//
//

//
// SCHEDULES TABLE - START TIME COLUMN

function SchedulesTableStartTimeColumn({ rowIndex, isReadOnly }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('SchedulesTable.start_time');
  const patternForm = usePatternFormContext();

  //
  // Formatters

  const handleUpdateStartTime = ({ target }) => {
    // Setup the raw value
    let formattedValue = target.value;
    // Remove any non-digit characters from the value
    formattedValue = formattedValue.replace(/\D/g, '');
    // Clip the value to 6 digits
    formattedValue = formattedValue.substr(0, 4);
    // Split the value into hours and minutes
    let hoursString = formattedValue.substr(0, 2);
    let minutesString = formattedValue.substr(2, 2);
    // Parse the hours
    if (hoursString && hoursString.length == 2) {
      // Format the hours
      let hoursInt = parseInt(hoursString);
      // If the hours are bigger than 27, clamp to 27
      if (hoursInt > 27) hoursString = '27';
      // If the hours are smaller than 4, clamp to 4
      else if (hoursInt < 4) hoursString = '04';
      // Add the : if hours is in range
      else hoursString = `${hoursString}`;
    }
    // Parse the minutes
    if (minutesString && minutesString.length == 2) {
      // Format the minutes
      let minutesInt = parseInt(minutesString);
      // If the minutes are bigger than 59, clamp to 59
      if (minutesInt > 59) minutesString = '59';
      // If the minutes are smaller than 0, clamp to 0
      else if (minutesInt < 0) minutesString = '00';
    }
    // Add the : double dots
    if (hoursString.length && !minutesString.length) formattedValue = `${hoursString}`;
    else if (hoursString.length && minutesString.length) formattedValue = `${hoursString}:${minutesString}`;
    // Save the value to the form
    patternForm.setFieldValue(`schedules.${rowIndex}.start_time`, formattedValue);
    //
  };

  //
  // Render components

  return (
    <div className={styles.column}>
      <Tooltip label={t('description')} position="bottom" withArrow>
        <TextInput
          aria-label={t('label')}
          placeholder={t('placeholder')}
          leftSection={<IconClockPlay size={18} />}
          {...patternForm.getInputProps(`schedules.${rowIndex}.start_time`)}
          onChange={handleUpdateStartTime}
          readOnly={isReadOnly}
          w={'100%'}
        />
      </Tooltip>
    </div>
  );

  //
}

//
//
//

//
// SCHEDULES TABLE - CALENDARS ON COLUMN

function SchedulesTableCalendarsOnColumn({ rowIndex, isReadOnly }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('SchedulesTable.calendars_on');
  const patternForm = usePatternFormContext();

  //
  // B. Fetch data

  const { data: allCalendarsData } = useSWR('/api/calendars');

  //
  // D. Format data

  const allCalendarsDataSimplified = useMemo(() => {
    if (!allCalendarsData) return [];
    return allCalendarsData.map((item) => {
      return { value: item._id, label: `[${item.code}] ${item.name || '-'}` };
    });
  }, [allCalendarsData]);

  //   const allCalendarsDataFormatted = useMemo(() => {
  //     if (!allCalendarsDataSimplified) return [];
  //     return allCalendarsDataSimplified.map((item) => {
  //       return { ...item, disabled: patternForm.values.schedules[rowIndex].calendars_off.includes(item._id) };
  //     });
  //   }, [allCalendarsDataSimplified, patternForm.values.schedules, rowIndex]);

  //
  // Render components

  return (
    <div className={styles.column}>
      <MultiSelect
        aria-label={t('label')}
        placeholder={t('placeholder')}
        nothingFoundMessage={t('nothingFound')}
        {...patternForm.getInputProps(`schedules.${rowIndex}.calendars_on`)}
        data={allCalendarsDataSimplified}
        leftSection={<IconCalendarCheck size={20} />}
        readOnly={isReadOnly}
        searchable
        w={'100%'}
      />
    </div>
  );

  //
}

//
//
//

//
// SCHEDULES TABLE - CALENDARS OFF COLUMN

function SchedulesTableCalendarsOffColumn({ rowIndex, isReadOnly }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('SchedulesTable.calendars_off');
  const patternForm = usePatternFormContext();

  const [allCalendarsDataSimplified, setAllCalendarsDataSimplified] = useState([]);
  const [allCalendarsDataFormatted, setAllCalendarsDataFormatted] = useState([]);

  //
  // B. Fetch data

  const { data: allCalendarsData } = useSWR('/api/calendars');

  //
  // D. Format data

  useState(() => {
    if (!allCalendarsData) return [];
    const simplified = allCalendarsData.map((item) => {
      return { value: item._id, label: `[${item.code}] ${item.name || '-'}` };
    });
    setAllCalendarsDataSimplified(simplified);
  }, [allCalendarsData]);

  useEffect(() => {
    if (!allCalendarsDataSimplified) return [];
    const formatted = allCalendarsDataSimplified.map((item) => {
      return { ...item, disabled: patternForm.values.schedules[rowIndex].calendars_on.includes(item._id) };
    });
    setAllCalendarsDataFormatted(formatted);
  }, [allCalendarsDataSimplified, patternForm.values.schedules, rowIndex]);

  //
  // Render components

  return (
    <div className={styles.column}>
      <MultiSelect
        aria-label={t('label')}
        placeholder={t('placeholder')}
        nothingFoundMessage={t('nothingFound')}
        {...patternForm.getInputProps(`schedules.${rowIndex}.calendars_off`)}
        data={allCalendarsDataFormatted}
        leftSection={<IconCalendarX size={20} />}
        readOnly={isReadOnly}
        searchable
        w={'100%'}
      />
    </div>
  );

  //
}

//
//
//

//
// SCHEDULES TABLE - CALENDAR DESC COLUMN

function SchedulesTableCalendarDescColumn({ rowIndex, isReadOnly }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('SchedulesTable.calendar_desc');
  const patternForm = usePatternFormContext();

  //
  // Render components

  return (
    <div className={styles.column}>
      <Tooltip label={t('description')} position="bottom" withArrow>
        <TextInput aria-label={t('label')} placeholder={t('placeholder')} {...patternForm.getInputProps(`schedules.${rowIndex}.calendar_desc`)} leftSection={<IconCalendarQuestion size={20} />} readOnly={isReadOnly} w={'100%'} />
      </Tooltip>
    </div>
  );

  //
}

//
//
//

//
// SCHEDULES TABLE - REMOVE TRIP COLUMN

function SchedulesTableRemoveTripColumn({ rowIndex, isReadOnly }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('SchedulesTable.remove');
  const patternForm = usePatternFormContext();

  //
  // A. Handle actions

  const handleRemoveTrip = () => {
    openConfirmModal({
      title: <Text size="h2">{t('modal.title')}</Text>,
      centered: true,
      closeOnClickOutside: true,
      children: <Text size="h3">{t('modal.description')}</Text>,
      labels: { confirm: t('modal.confirm'), cancel: t('modal.cancel') },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        patternForm.removeListItem('schedules', rowIndex);
      },
    });
  };

  //
  // Render components

  return (
    <div className={`${styles.column} ${styles.hend}`}>
      <AuthGate scope="lines" permission="create_edit">
        <Tooltip label={t('description')} position="bottom" withArrow>
          <ActionIcon size="lg" variant="subtle" color="red" onClick={handleRemoveTrip} disabled={isReadOnly}>
            <IconBackspace size={20} />
          </ActionIcon>
        </Tooltip>
      </AuthGate>
    </div>
  );

  //
}

//
//
//
//
//
//
//

function SchedulesTableRow({ rowIndex, isReadOnly }) {
  return (
    <div className={`${styles.row} ${styles.bodyRow}`}>
      <SchedulesTableStartTimeColumn rowIndex={rowIndex} isReadOnly={isReadOnly} />
      <SchedulesTableCalendarsOnColumn rowIndex={rowIndex} isReadOnly={isReadOnly} />
      {/* <SchedulesTableCalendarsOffColumn rowIndex={rowIndex} isReadOnly={isReadOnly} /> */}
      {/* <SchedulesTableCalendarDescColumn rowIndex={rowIndex} isReadOnly={isReadOnly} /> */}
      <SchedulesTableRemoveTripColumn rowIndex={rowIndex} isReadOnly={isReadOnly} />
    </div>
  );
}

//
//
//

//
// SCHEDULES TABLE - ADD TRIP

function SchedulesTableAddTrip({ isReadOnly }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('SchedulesTable.add');
  const patternForm = usePatternFormContext();

  //
  // A. Handle actions

  const handleAddTrip = () => {
    patternForm.insertListItem('schedules', { ...PatternScheduleDefault });
  };

  //
  // Render components

  return (
    <div className={`${styles.bodyRow} ${styles.addTripRow}`}>
      <div className={styles.column}>
        <AuthGate scope="lines" permission="create_edit">
          <Button leftSection={<IconPlus size={16} />} variant="default" size="xs" onClick={handleAddTrip} disabled={isReadOnly}>
            {t('label')}
          </Button>
        </AuthGate>
      </div>
    </div>
  );

  //
}

//
//
//

//
// SCHEDULES TABLE - HEADER

function SchedulesTableHeader() {
  //

  //
  // A. Setup variables

  const t = useTranslations('SchedulesTable');

  //
  // Render components

  return (
    <div className={`${styles.row} ${styles.headerRow}`}>
      <div className={styles.column}>{t('start_time.header.title')}</div>
      <div className={styles.column}>{t('calendars_on.header.title')}</div>
      {/* <div className={styles.column}>{t('calendars_off.header.title')}</div> */}
      {/* <div className={styles.column}>{t('calendar_desc.header.title')}</div> */}
      <div className={styles.column} />
    </div>
  );

  //
}

//
//
//

//
// SCHEDULES TABLE

export default function SchedulesTable({ isReadOnly }) {
  //

  //
  // A. Setup variables

  const patternForm = usePatternFormContext();

  //
  // Render components

  return (
    <div className={styles.container}>
      <SchedulesTableHeader />
      <div className={styles.body}>
        {patternForm?.values?.schedules?.map((item, index) => (
          <SchedulesTableRow key={index} rowIndex={index} isReadOnly={isReadOnly} />
        ))}
        <SchedulesTableAddTrip isReadOnly={isReadOnly} />
      </div>
    </div>
  );

  //
}
