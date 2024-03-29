'use client';

import useSWR from 'swr';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from '@/translations/navigation';
import { useForm, yupResolver } from '@mantine/form';
import API from '@/services/API';
import { CalendarValidation } from '@/schemas/Calendar/validation';
import { CalendarDefault } from '@/schemas/Calendar/default';
import { Tooltip, SimpleGrid, TextInput, ActionIcon, Divider, NumberInput, Button, Group } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import Pannel from '@/components/Pannel/Pannel';
import { Section } from '@/components/Layouts/Layouts';
import Text from '@/components/Text/Text';
import AutoSave from '@/components/AutoSave/AutoSave';
import notify from '@/services/notify';
import { openConfirmModal } from '@mantine/modals';
import { useTranslations } from 'next-intl';
import HCalendar from '@/components/HCalendar/HCalendar';
import HCalendarToggle from '@/components/HCalendarToggle/HCalendarToggle';
import { useSession } from 'next-auth/react';
import isAllowed from '@/authentication/isAllowed';
import LockButton from '@/components/LockButton/LockButton';
import populate from '@/services/populate';
import CalendarPatternsView from '@/components/CalendarPatternsView/CalendarPatternsView';
import ListHeader from '@/components/ListHeader/ListHeader';
import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import calculateDateDayType from '@/services/calculateDateDayType';

export default function Page() {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const t = useTranslations('calendars');
  const [isSaving, setIsSaving] = useState(false);
  const [isLocking, setIsLocking] = useState(false);
  const [hasErrorSaving, setHasErrorSaving] = useState();
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: sessionData } = useSession();

  const { calendar_id } = useParams();

  //
  // B. Fetch data

  const { mutate: allCalendarsMutate } = useSWR('/api/calendars');
  const { data: calendarData, error: calendarError, isLoading: calendarLoading, mutate: calendarMutate } = useSWR(calendar_id && `/api/calendars/${calendar_id}`, { onSuccess: (data) => keepFormUpdated(data) });
  const { data: allDatesData } = useSWR('/api/dates');
  const { data: allCalendarAssociatedPatternsData, isLoading: allCalendarAssociatedPatternsLoading } = useSWR(calendar_id && `/api/calendars/${calendar_id}/associatedPatterns`);

  //
  // C. Setup form

  const form = useForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    clearInputErrorOnChange: true,
    validate: yupResolver(CalendarValidation),
    initialValues: populate(CalendarDefault, calendarData),
  });

  const keepFormUpdated = (data) => {
    if (!form.isDirty()) {
      const populated = populate(CalendarDefault, data);
      form.setValues(populated);
      form.resetDirty(populated);
    }
  };

  //
  // D. Setup readonly

  const isReadOnly = !isAllowed(sessionData, [{ scope: 'calendars', action: 'edit' }], { handleError: true }) || calendarData?.is_locked;

  //
  // E. Handle actions

  const handleValidate = () => {
    form.validate();
  };

  const handleClose = async () => {
    router.push(`/calendars/`);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await API({ service: 'calendars', resourceId: calendar_id, operation: 'edit', method: 'PUT', body: form.values });
      calendarMutate();
      allCalendarsMutate();
      form.resetDirty();
      setIsSaving(false);
      setIsLocking(false);
      setHasErrorSaving(false);
    } catch (error) {
      console.log(error);
      setIsSaving(false);
      setIsLocking(false);
      setHasErrorSaving(error);
    }
  };

  const handleLock = async () => {
    try {
      setIsLocking(true);
      await API({ service: 'calendars', resourceId: calendar_id, operation: 'lock', method: 'PUT' });
      calendarMutate();
      setIsLocking(false);
    } catch (err) {
      console.log(err);
      calendarMutate();
      setIsLocking(false);
    }
  };

  const handleDelete = async () => {
    openConfirmModal({
      title: <Text size="h2">{t('operations.delete.title')}</Text>,
      centered: true,
      closeOnClickOutside: true,
      children: <Text size="h3">{t('operations.delete.description')}</Text>,
      labels: { confirm: t('operations.delete.confirm'), cancel: t('operations.delete.cancel') },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          setIsDeleting(true);
          notify(calendar_id, 'loading', t('operations.delete.loading'));
          await API({ service: 'calendars', resourceId: calendar_id, operation: 'delete', method: 'DELETE' });
          allCalendarsMutate();
          router.push('/calendars');
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

  const handleTurnOnDayTypeOne = () => {
    if (!allDatesData) return;
    const matchingDates = allDatesData.filter((dateObj) => calculateDateDayType(dateObj.date, dateObj.is_holiday) === '1').map((dateObj) => dateObj.date);
    if (!matchingDates.length) return;
    const uniqueSetOfDates = new Set(form.values.dates);
    matchingDates.forEach((date) => uniqueSetOfDates.add(date));
    form.setFieldValue('dates', [...uniqueSetOfDates]);
  };

  const handleTurnOffDayTypeOne = () => {
    if (!allDatesData) return;
    const matchingDates = allDatesData.filter((dateObj) => calculateDateDayType(dateObj.date, dateObj.is_holiday) === '1').map((dateObj) => dateObj.date);
    if (!matchingDates.length) return;
    const uniqueSetOfDates = new Set(form.values.dates);
    matchingDates.forEach((date) => uniqueSetOfDates.delete(date));
    form.setFieldValue('dates', [...uniqueSetOfDates]);
  };

  const handleTurnOnDayTypeTwo = () => {
    if (!allDatesData) return;
    const matchingDates = allDatesData.filter((dateObj) => calculateDateDayType(dateObj.date, dateObj.is_holiday) === '2').map((dateObj) => dateObj.date);
    if (!matchingDates.length) return;
    const uniqueSetOfDates = new Set(form.values.dates);
    matchingDates.forEach((date) => uniqueSetOfDates.add(date));
    form.setFieldValue('dates', [...uniqueSetOfDates]);
  };

  const handleTurnOffDayTypeTwo = () => {
    if (!allDatesData) return;
    const matchingDates = allDatesData.filter((dateObj) => calculateDateDayType(dateObj.date, dateObj.is_holiday) === '2').map((dateObj) => dateObj.date);
    if (!matchingDates.length) return;
    const uniqueSetOfDates = new Set(form.values.dates);
    matchingDates.forEach((date) => uniqueSetOfDates.delete(date));
    form.setFieldValue('dates', [...uniqueSetOfDates]);
  };

  const handleTurnOnDayTypeThree = () => {
    if (!allDatesData) return;
    const matchingDates = allDatesData.filter((dateObj) => calculateDateDayType(dateObj.date, dateObj.is_holiday) === '3').map((dateObj) => dateObj.date);
    if (!matchingDates.length) return;
    const uniqueSetOfDates = new Set(form.values.dates);
    matchingDates.forEach((date) => uniqueSetOfDates.add(date));
    form.setFieldValue('dates', [...uniqueSetOfDates]);
  };

  const handleTurnOffDayTypeThree = () => {
    if (!allDatesData) return;
    const matchingDates = allDatesData.filter((dateObj) => calculateDateDayType(dateObj.date, dateObj.is_holiday) === '3').map((dateObj) => dateObj.date);
    if (!matchingDates.length) return;
    const uniqueSetOfDates = new Set(form.values.dates);
    matchingDates.forEach((date) => uniqueSetOfDates.delete(date));
    form.setFieldValue('dates', [...uniqueSetOfDates]);
  };

  const handleTurnOnPeriodOne = () => {
    if (!allDatesData) return;
    const matchingDates = allDatesData.filter((dateObj) => dateObj.period === '1').map((dateObj) => dateObj.date);
    if (!matchingDates.length) return;
    const uniqueSetOfDates = new Set(form.values.dates);
    matchingDates.forEach((date) => uniqueSetOfDates.add(date));
    form.setFieldValue('dates', [...uniqueSetOfDates]);
  };

  const handleTurnOffPeriodOne = () => {
    if (!allDatesData) return;
    const matchingDates = allDatesData.filter((dateObj) => dateObj.period === '1').map((dateObj) => dateObj.date);
    if (!matchingDates.length) return;
    const uniqueSetOfDates = new Set(form.values.dates);
    matchingDates.forEach((date) => uniqueSetOfDates.delete(date));
    form.setFieldValue('dates', [...uniqueSetOfDates]);
  };

  const handleTurnOnPeriodTwo = () => {
    if (!allDatesData) return;
    const matchingDates = allDatesData.filter((dateObj) => dateObj.period === '2').map((dateObj) => dateObj.date);
    if (!matchingDates.length) return;
    const uniqueSetOfDates = new Set(form.values.dates);
    matchingDates.forEach((date) => uniqueSetOfDates.add(date));
    form.setFieldValue('dates', [...uniqueSetOfDates]);
  };

  const handleTurnOffPeriodTwo = () => {
    if (!allDatesData) return;
    const matchingDates = allDatesData.filter((dateObj) => dateObj.period === '2').map((dateObj) => dateObj.date);
    if (!matchingDates.length) return;
    const uniqueSetOfDates = new Set(form.values.dates);
    matchingDates.forEach((date) => uniqueSetOfDates.delete(date));
    form.setFieldValue('dates', [...uniqueSetOfDates]);
  };

  const handleTurnOnPeriodThree = () => {
    if (!allDatesData) return;
    const matchingDates = allDatesData.filter((dateObj) => dateObj.period === '3').map((dateObj) => dateObj.date);
    if (!matchingDates.length) return;
    const uniqueSetOfDates = new Set(form.values.dates);
    matchingDates.forEach((date) => uniqueSetOfDates.add(date));
    form.setFieldValue('dates', [...uniqueSetOfDates]);
  };

  const handleTurnOffPeriodThree = () => {
    if (!allDatesData) return;
    const matchingDates = allDatesData.filter((dateObj) => dateObj.period === '3').map((dateObj) => dateObj.date);
    if (!matchingDates.length) return;
    const uniqueSetOfDates = new Set(form.values.dates);
    matchingDates.forEach((date) => uniqueSetOfDates.delete(date));
    form.setFieldValue('dates', [...uniqueSetOfDates]);
  };

  //
  // F. Setup components

  const renderDateCardComponent = ({ key, ...props }) => {
    return <HCalendarToggle key={key} activeDates={form.values.dates} onToggle={handleToggleDate} readOnly={isReadOnly} {...props} />;
  };

  //
  // E. Render components

  return (
    <Pannel
      loading={calendarLoading || isDeleting}
      header={
        <ListHeader>
          <AutoSave
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
          <Text size="h1" style={!form.values.name && 'untitled'} full>
            {form.values.name || t('untitled')}
          </Text>
          <AppAuthenticationCheck permissions={[{ scope: 'lines', action: 'view' }]}>
            <CalendarPatternsView calendar_id={calendar_id} />
          </AppAuthenticationCheck>
          <AppAuthenticationCheck permissions={[{ scope: 'calendars', action: 'lock' }]}>
            <LockButton isLocked={calendarData?.is_locked} onClick={handleLock} loading={isLocking} />
          </AppAuthenticationCheck>
          <AppAuthenticationCheck permissions={[{ scope: 'calendars', action: 'delete' }]}>
            <Tooltip label={t('operations.delete.title')} color="red" position="bottom" withArrow disabled={calendarData?.is_locked || allCalendarAssociatedPatternsData?.length > 0}>
              <ActionIcon color="red" variant="light" size="lg" onClick={handleDelete} loading={calendarLoading || allCalendarAssociatedPatternsLoading} disabled={calendarData?.is_locked || allCalendarAssociatedPatternsData?.length > 0}>
                <IconTrash size={20} />
              </ActionIcon>
            </Tooltip>
          </AppAuthenticationCheck>
        </ListHeader>
      }
    >
      <form onSubmit={form.onSubmit(async () => await handleSave())}>
        <Section>
          <div>
            <Text size="h2">{t('sections.config.title')}</Text>
            <Text size="h4">{t('sections.config.description')}</Text>
          </div>
          <SimpleGrid cols={4}>
            <TextInput label={t('form.code.label')} placeholder={t('form.code.placeholder')} {...form.getInputProps('code')} readOnly={isReadOnly} />
            <NumberInput label={t('form.numeric_code.label')} placeholder={t('form.numeric_code.placeholder')} {...form.getInputProps('numeric_code')} readOnly={isReadOnly} min={0} />
          </SimpleGrid>
          <SimpleGrid cols={2}>
            <TextInput label={t('form.name.label')} placeholder={t('form.name.placeholder')} {...form.getInputProps('name')} readOnly={isReadOnly} />
            <TextInput label={t('form.description.label')} placeholder={t('form.description.placeholder')} {...form.getInputProps('description')} readOnly={isReadOnly} />
          </SimpleGrid>
        </Section>
        <Divider />
        <AppLayoutSection>
          <SimpleGrid cols={3}>
            <Button.Group>
              <Button w="100%" variant="default" onClick={handleTurnOnDayTypeOne}>
                Ligar Dias Úteis
              </Button>
              <Button w="100%" variant="default" onClick={handleTurnOffDayTypeOne}>
                Desligar Dias Úteis
              </Button>
            </Button.Group>
            <Button.Group>
              <Button w="100%" variant="default" onClick={handleTurnOnDayTypeTwo}>
                Ligar Sábados
              </Button>
              <Button w="100%" variant="default" onClick={handleTurnOffDayTypeTwo}>
                Desligar Sábados
              </Button>
            </Button.Group>
            <Button.Group>
              <Button w="100%" variant="default" onClick={handleTurnOnDayTypeThree}>
                Ligar Domingos e Feriados
              </Button>
              <Button w="100%" variant="default" onClick={handleTurnOffDayTypeThree}>
                Desligar Domingos e Feriados
              </Button>
            </Button.Group>
          </SimpleGrid>
          <SimpleGrid cols={3}>
            <Button.Group>
              <Button w="100%" variant="default" onClick={handleTurnOnPeriodOne}>
                Ligar Escolar
              </Button>
              <Button w="100%" variant="default" onClick={handleTurnOffPeriodOne}>
                Desligar Escolar
              </Button>
            </Button.Group>
            <Button.Group>
              <Button w="100%" variant="default" onClick={handleTurnOnPeriodTwo}>
                Ligar Férias
              </Button>
              <Button w="100%" variant="default" onClick={handleTurnOffPeriodTwo}>
                Desligar Férias
              </Button>
            </Button.Group>
            <Button.Group>
              <Button w="100%" variant="default" onClick={handleTurnOnPeriodThree}>
                Ligar Verão
              </Button>
              <Button w="100%" variant="default" onClick={handleTurnOffPeriodThree}>
                Desligar Verão
              </Button>
            </Button.Group>
          </SimpleGrid>
        </AppLayoutSection>
        <Divider />
        <HCalendar availableDates={allDatesData} renderCardComponent={renderDateCardComponent} onMultiSelect={handleMultiToggleDates} />
      </form>
    </Pannel>
  );
}
