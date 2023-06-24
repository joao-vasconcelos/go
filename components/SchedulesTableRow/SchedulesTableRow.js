'use client';

import useSWR from 'swr';
import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import AuthGate, { isAllowed } from '@/components/AuthGate/AuthGate';
import { usePatternFormContext } from '@/contexts/patternForm';
import styles from './SchedulesTableRow.module.css';
import { ActionIcon, MultiSelect, Tooltip, TextInput } from '@mantine/core';
import { IconClockPlay, IconCalendarCheck, IconCalendarOff, IconCalendarQuestion, IconBackspace } from '@tabler/icons-react';
import { openConfirmModal } from '@mantine/modals';
import Text from '../Text/Text';

//
//
//

//
// SCHEDULES TABLE - START TIME COLUMN

export function SchedulesTableStartTimeColumn({ rowIndex }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('SchedulesTableRow');
  const { data: session } = useSession();
  const isReadOnly = !isAllowed(session, 'lines', 'create_edit');
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
      <Tooltip label={t('start_time.description')} position='bottom' withArrow>
        <TextInput
          aria-label={t('start_time.label')}
          placeholder={t('start_time.placeholder')}
          icon={<IconClockPlay size={18} />}
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

export function SchedulesTableCalendarsOnColumn({ rowIndex }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('SchedulesTableRow');
  const { data: session } = useSession();
  const isReadOnly = !isAllowed(session, 'lines', 'create_edit');
  const patternForm = usePatternFormContext();

  //
  // B. Fetch data

  const { data: allCalendarsData } = useSWR('/api/calendars');

  //
  // D. Format data

  const allCalendarsDataFormatted = useMemo(() => {
    if (!allCalendarsData) return [];
    return allCalendarsData.map((item) => {
      return { value: item._id, label: item.name || '-', disabled: patternForm.values.schedules[rowIndex].calendars_off.includes(item._id) };
    });
  }, [allCalendarsData, patternForm.values.schedules, rowIndex]);

  //
  // Render components

  return (
    <div className={styles.column}>
      <MultiSelect
        aria-label={t('calendars_on.label')}
        placeholder={t('calendars_on.placeholder')}
        nothingFound={t('calendars_on.nothingFound')}
        {...patternForm.getInputProps(`schedules.${rowIndex}.calendars_on`)}
        data={allCalendarsDataFormatted}
        icon={<IconCalendarCheck size={20} />}
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

export function SchedulesTableCalendarsOffColumn({ rowIndex }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('SchedulesTableRow');
  const { data: session } = useSession();
  const isReadOnly = !isAllowed(session, 'lines', 'create_edit');
  const patternForm = usePatternFormContext();

  //
  // B. Fetch data

  const { data: allCalendarsData } = useSWR('/api/calendars');

  //
  // D. Format data

  const allCalendarsDataFormatted = useMemo(() => {
    if (!allCalendarsData) return [];
    return allCalendarsData.map((item) => {
      return { value: item._id, label: item.name || '-', disabled: patternForm.values.schedules[rowIndex].calendars_on.includes(item._id) };
    });
  }, [allCalendarsData, patternForm.values.schedules, rowIndex]);

  //
  // Render components

  return (
    <div className={styles.column}>
      <MultiSelect
        aria-label={t('calendars_off.label')}
        placeholder={t('calendars_off.placeholder')}
        nothingFound={t('calendars_off.nothingFound')}
        {...patternForm.getInputProps(`schedules.${rowIndex}.calendars_off`)}
        data={allCalendarsDataFormatted}
        icon={<IconCalendarOff size={20} />}
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

export function SchedulesTableCalendarDescColumn({ rowIndex }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('SchedulesTableRow');
  const { data: session } = useSession();
  const isReadOnly = !isAllowed(session, 'lines', 'create_edit');
  const patternForm = usePatternFormContext();

  //
  // Render components

  return (
    <div className={styles.column}>
      <Tooltip label={t('calendar_desc.description')} position='bottom' withArrow>
        <TextInput aria-label={t('calendar_desc.label')} placeholder={t('calendar_desc.placeholder')} {...patternForm.getInputProps(`schedules.${rowIndex}.calendar_desc`)} icon={<IconCalendarQuestion size={20} />} readOnly={isReadOnly} w={'100%'} />
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

export function SchedulesTableRemoveTripColumn({ rowIndex }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('SchedulesTableRow');
  const patternForm = usePatternFormContext();

  //
  // A. Handle actions

  const handleRemoveTrip = () => {
    openConfirmModal({
      title: <Text size='h2'>{t('remove.modal.title')}</Text>,
      centered: true,
      closeOnClickOutside: true,
      children: <Text size='h3'>{t('remove.modal.description')}</Text>,
      labels: { confirm: t('remove.modal.confirm'), cancel: t('remove.modal.cancel') },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        patternForm.removeListItem('schedules', rowIndex);
      },
    });
  };

  //
  // Render components

  return (
    <div className={styles.column}>
      <AuthGate scope='lines' permission='create_edit'>
        <Tooltip label={t('remove.description')} position='bottom' withArrow>
          <ActionIcon size='lg' color='red' onClick={handleRemoveTrip}>
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

export default function SchedulesTableRow({ rowIndex, onRemove }) {
  return (
    <div className={styles.tableBodyRow}>
      <SchedulesTableStartTimeColumn rowIndex={rowIndex} />
      <SchedulesTableCalendarsOnColumn rowIndex={rowIndex} />
      <SchedulesTableCalendarsOffColumn rowIndex={rowIndex} />
      <SchedulesTableCalendarDescColumn rowIndex={rowIndex} />
      <SchedulesTableRemoveTripColumn rowIndex={rowIndex} />
    </div>
  );

  //
}
