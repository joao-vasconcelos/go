'use client';

import useSWR from 'swr';
import { styled } from '@stitches/react';
import { useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, yupResolver } from '@mantine/form';
import API from '../../../../services/API';
import { Validation as CalendarValidation } from '../../../../schemas/Calendar/validation';
import { Default as CalendarDefault } from '../../../../schemas/Calendar/default';
import { Tooltip, NumberInput, Select, SimpleGrid, TextInput, ActionIcon, Text, MultiSelect, Divider } from '@mantine/core';
import { TbTrash } from 'react-icons/tb';
import Pannel from '../../../../layouts/Pannel';
import SaveButtons from '../../../../components/SaveButtons';
import notify from '../../../../services/notify';
import { openConfirmModal } from '@mantine/modals';
import HeaderTitle from '../../../../components/lists/HeaderTitle';
import HorizontalCalendarToggle from '../../../../components/HorizontalCalendarToggle/HorizontalCalendarToggle';

const SectionTitle = styled('p', {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '$gray12',
});

const Section = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  padding: '$lg',
  gap: '$md',
  width: '100%',
  maxHeight: '100%',
});

export default function Page() {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [hasErrorSaving, setHasErrorSaving] = useState();

  const { calendar_id } = useParams();

  //
  // B. Fetch data

  const { data: datesData, error: datesError, isLoading: datesLoading, isValidating: datesValidating } = useSWR('/api/dates');
  const { data: calendarData, error: calendarError, isLoading: calendarLoading } = useSWR(calendar_id && `/api/calendars/${calendar_id}`, { onSuccess: (data) => keepFormUpdated(data) });

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
    console.log('form.values.dates', form.values.dates);
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
      form.resetDirty();
      setIsSaving(false);
      setHasErrorSaving(false);
    } catch (err) {
      console.log(err);
      setIsSaving(false);
      setHasErrorSaving(err);
    }
  }, [calendar_id, form]);

  const handleDelete = async () => {
    openConfirmModal({
      title: (
        <Text size={'lg'} fw={700}>
          Eliminar Calendário?
        </Text>
      ),
      centered: true,
      closeOnClickOutside: true,
      children: <Text>Eliminar é irreversível. Tem a certeza que quer eliminar este Calendário para sempre?</Text>,
      labels: { confirm: 'Eliminar Calendário', cancel: 'Não Eliminar' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          notify(calendar_id, 'loading', 'A eliminar Calendário...');
          await API({ service: 'calendars', resourceId: calendar_id, operation: 'delete', method: 'DELETE' });
          router.push('/dashboard/calendars');
          notify(calendar_id, 'success', 'Calendário eliminado!');
        } catch (err) {
          console.log(err);
          notify(calendar_id, 'error', err.message || 'Occoreu um erro.');
        }
      },
    });
  };

  const handleToggleDate = (dateObj) => {
    //

    //
    const index = form.values.dates.findIndex((obj) => obj.date === dateObj.date);

    if (index >= 0) {
      // Date string is present in the array, so remove the object
      const newArray = form.values.dates.filter((obj) => obj.date !== dateObj.date);
      form.setFieldValue('dates', newArray);
    } else {
      // Date string is not present in the array, so add a new object
      form.setFieldValue('dates', [...form.values.dates, dateObj]);
    }
  };

  //
  // E. Render components

  return (
    <Pannel
      loading={calendarLoading}
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
          <HeaderTitle text={form.values.calendar_long_name || 'Calendário Sem Nome'} />
          <Tooltip label='Eliminar Calendário' color='red' position='bottom' withArrow>
            <ActionIcon color='red' variant='light' size='lg' onClick={handleDelete}>
              <TbTrash size='20px' />
            </ActionIcon>
          </Tooltip>
        </>
      }
    >
      <form onSubmit={form.onSubmit(async () => await handleSave())}>
        <Section>
          <SectionTitle>Configuração do Calendário</SectionTitle>
          <SimpleGrid cols={2}>
            <TextInput label='Código do Calendário' placeholder='Codigo do Calendario' {...form.getInputProps('code')} />
            <TextInput label='Nome do Calendário' placeholder='Nome' {...form.getInputProps('name')} />
          </SimpleGrid>
        </Section>
        <Divider />
        <Section>
          <SectionTitle>Datas deste Calendário</SectionTitle>
          <HorizontalCalendarToggle allDates={datesData} activeDates={form.values.dates} onToggleDate={handleToggleDate} />
        </Section>
      </form>
    </Pannel>
  );
}
