'use client';

import useSWR from 'swr';
import { useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, yupResolver } from '@mantine/form';
import API from '../../../../../services/API';
import { Validation as CalendarValidation } from '../../../../../schemas/Calendar/validation';
import { Default as CalendarDefault } from '../../../../../schemas/Calendar/default';
import { Tooltip, Switch, SimpleGrid, TextInput, ActionIcon, Divider } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import Pannel from '../../../../../components/Pannel/Pannel';
import { Section } from '../../../../../components/Layouts/Layouts';
import Text from '../../../../../components/Text/Text';
import SaveButtons from '../../../../../components/SaveButtons';
import notify from '../../../../../services/notify';
import { openConfirmModal } from '@mantine/modals';
import { useTranslations } from 'next-intl';
import HCalendar from '../../../../../components/HCalendar/HCalendar';
import HCalendarToggle from '../../../../../components/HCalendarToggle/HCalendarToggle';
import { useSession } from 'next-auth/react';
import AuthGate, { isAllowed } from '../../../../../components/AuthGate/AuthGate';

export default function Page() {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const t = useTranslations('calendars');
  const [isSaving, setIsSaving] = useState(false);
  const [hasErrorSaving, setHasErrorSaving] = useState();
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: session } = useSession();
  const isReadOnly = !isAllowed(session, 'calendars', 'create_edit');

  const { calendar_id } = useParams();

  //
  // B. Fetch data

  const { mutate: allCalendarsMutate } = useSWR('/api/calendars');
  const { data: calendarData, error: calendarError, isLoading: calendarLoading } = useSWR(calendar_id && `/api/calendars/${calendar_id}`, { onSuccess: (data) => keepFormUpdated(data) });
  const { data: allDatesData, error: allDatesError, isLoading: allDatesLoading, isValidating: allDatesValidating } = useSWR('/api/dates');

  //
  // C. Setup form

  const form = useForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    clearInputErrorOnChange: true,
    validate: yupResolver(CalendarValidation),
    initialValues: calendarData || CalendarDefault,
  });

  const keepFormUpdated = (data) => {
    if (!form.isDirty()) {
      form.setValues(data);
      form.resetDirty(data);
    }
  };

  //
  // D. Handle actions

  const handleValidate = () => {
    form.validate();
  };

  const handleClose = async () => {
    router.push(`/dashboard/calendars/`);
  };

  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);
      await API({ service: 'calendars', resourceId: calendar_id, operation: 'edit', method: 'PUT', body: form.values });
      allCalendarsMutate();
      form.resetDirty();
      setIsSaving(false);
      setHasErrorSaving(false);
    } catch (err) {
      console.log(err);
      setIsSaving(false);
      setHasErrorSaving(err);
    }
  }, [calendar_id, form, allCalendarsMutate]);

  const handleDelete = async () => {
    openConfirmModal({
      title: <Text size='h2'>{t('operations.delete.title')}</Text>,
      centered: true,
      closeOnClickOutside: true,
      children: <Text size='h3'>{t('operations.delete.description')}</Text>,
      labels: { confirm: t('operations.delete.confirm'), cancel: t('operations.delete.cancel') },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          setIsDeleting(true);
          notify(calendar_id, 'loading', t('operations.delete.loading'));
          await API({ service: 'calendars', resourceId: calendar_id, operation: 'delete', method: 'DELETE' });
          allCalendarsMutate();
          router.push('/dashboard/calendars');
          notify(calendar_id, 'success', t('operations.delete.success'));
          setIsDeleting(false);
        } catch (err) {
          console.log(err);
          setIsDeleting(false);
          notify(calendar_id, 'error', err.message || t('operations.delete.error'));
        }
      },
    });
  };

  const handleToggleDate = (dateObj) => {
    if (form.values.dates.includes(dateObj.date)) {
      // Date string is present in the array, so remove the object
      const newArray = form.values.dates.filter((date) => date !== dateObj.date);
      form.setFieldValue('dates', newArray);
    } else {
      // Date string is not present in the array, so add a new object
      form.setFieldValue('dates', [...form.values.dates, dateObj.date]);
    }
  };

  const handleMultiToggleDates = (selectedDates) => {
    //
    const arrayOfSelectedDates = selectedDates.map((dateObj) => dateObj.date);
    //
    const datesThatAreNotYetSelected = arrayOfSelectedDates.filter((date) => !form.values.dates.includes(date));
    const datesThatAreAlreadySelected = form.values.dates.filter((date) => arrayOfSelectedDates.includes(date));
    //
    if (datesThatAreNotYetSelected.length >= datesThatAreAlreadySelected.length) {
      // Include all the dates that were not yet selected
      form.setFieldValue('dates', [...form.values.dates, ...datesThatAreNotYetSelected]);
    } else {
      // Remove all the dates that were not yet selected
      const newDatesArray = form.values.dates.filter((date) => !arrayOfSelectedDates.includes(date));
      form.setFieldValue('dates', newDatesArray);
    }
  };

  //
  // E. Render components

  const renderDateCardComponent = ({ key, ...props }) => {
    return <HCalendarToggle key={key} activeDates={form.values.dates} onToggle={handleToggleDate} readOnly={isReadOnly} {...props} />;
  };

  //
  // E. Render components

  return (
    <Pannel
      loading={calendarLoading || isDeleting}
      header={
        <>
          <SaveButtons
            isValid={form.isValid()}
            isDirty={form.isDirty()}
            isLoading={calendarLoading}
            isErrorValidating={calendarError}
            isSaving={isSaving}
            isErrorSaving={hasErrorSaving}
            onValidate={() => handleValidate()}
            onSave={async () => await handleSave()}
            onClose={async () => await handleClose()}
          />
          <Text size='h1' style={!form.values.name && 'untitled'} full>
            {form.values.name || t('untitled')}
          </Text>
          <AuthGate scope='calendars' permission='delete'>
            <Tooltip label={t('operations.delete.title')} color='red' position='bottom' withArrow>
              <ActionIcon color='red' variant='light' size='lg' onClick={handleDelete}>
                <IconTrash size='20px' />
              </ActionIcon>
            </Tooltip>
          </AuthGate>
        </>
      }
    >
      <form onSubmit={form.onSubmit(async () => await handleSave())}>
        <Section>
          <Text size='h2'>{t('sections.config.title')}</Text>
          <SimpleGrid cols={2}>
            <TextInput label={t('form.name.label')} placeholder={t('form.name.placeholder')} {...form.getInputProps('name')} readOnly={isReadOnly} />
            <TextInput label={t('form.code.label')} placeholder={t('form.code.placeholder')} {...form.getInputProps('code')} readOnly={isReadOnly} />
          </SimpleGrid>
        </Section>
        <Divider />
        <Section>
          <Switch label={t('form.is_holiday.label')} description={t('form.is_holiday.description')} size='md' {...form.getInputProps('is_holiday', { type: 'checkbox' })} readOnly={isReadOnly} />
        </Section>
        <Divider />
        <HCalendar availableDates={allDatesData} renderCardComponent={renderDateCardComponent} onMultiSelect={handleMultiToggleDates} />
      </form>
    </Pannel>
  );
}
