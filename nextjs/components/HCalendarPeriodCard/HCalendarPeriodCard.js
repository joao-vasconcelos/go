'use client';

import useSWR from 'swr';
import styles from './HCalendarPeriodCard.module.css';
import { useState } from 'react';
import API from '../../services/API';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { useTranslations } from 'next-intl';
import { DateDefault } from '@/schemas/Date/default';
import { Modal, SimpleGrid, Textarea, Select, Button, LoadingOverlay, Switch } from '@mantine/core';
import dayjs from 'dayjs';
import Text from '../Text/Text';
import calculateDateDayType from '@/services/calculateDateDayType';
import populate from '@/services/populate';
import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';

export default function HCalendarPeriodCard({ date, dateObj, readOnly }) {
  //

  //
  // A. Setup variables
  const t = useTranslations('dates');
  const [isModalPresented, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [hasErrorUpdating, setHasErrorUpdating] = useState(false);

  const dayString = dayjs(date).format('D');
  const fullDateString = dayjs(date).locale('pt').format('dddd, DD MMM YYYY');

  //
  // B. Render components

  const form = useForm({
    initialValues: populate(DateDefault, dateObj),
  });

  //
  // C. Fetch data

  const { mutate: allDatesMutate } = useSWR('/api/dates');

  //
  // B. Render components

  const handleUpdate = async () => {
    try {
      setIsUpdating(true);
      const dayType = calculateDateDayType(form.values.date, form.values.is_holiday);
      await API({ service: 'dates', resourceId: dateObj._id, operation: 'edit', method: 'PUT', body: { ...form.values, day_type: dayType } });
      allDatesMutate();
      setIsUpdating(false);
      setHasErrorUpdating(false);
      closeModal();
    } catch (err) {
      console.log(err);
      setIsUpdating(false);
      setHasErrorUpdating(err);
    }
  };

  const handleDelete = async () => {
    try {
      setIsUpdating(true);
      await API({ service: 'dates', resourceId: dateObj._id, operation: 'delete', method: 'DELETE' });
      allDatesMutate();
      setIsUpdating(false);
      setHasErrorUpdating(false);
      closeModal();
    } catch (err) {
      console.log(err);
      setIsUpdating(false);
      setHasErrorUpdating(err);
    }
  };

  //
  // B. Render components

  return (
    <>
      <Modal opened={isModalPresented} onClose={closeModal} title={fullDateString} size="500px" centered>
        <form onSubmit={form.onSubmit(handleUpdate)}>
          <LoadingOverlay visible={isUpdating} />
          <SimpleGrid cols={1}>
            <Select
              label={t('form.period.label')}
              placeholder={t('form.period.placeholder')}
              nothingFoundMessage={t('form.period.nothingFound')}
              {...form.getInputProps('period')}
              data={[
                { value: '1', label: '1 - Período Escolar' },
                { value: '2', label: '2 - Período de Férias Escolares' },
                { value: '3', label: '3 - Período de Verão' },
              ]}
              readOnly={readOnly}
              searchable
            />
            <Text size="h4">day_type: {dateObj.day_type}</Text>
            <Switch label={'is_holiday'} description={'is_holiday or not'} {...form.getInputProps('is_holiday', { type: 'checkbox' })} />
            <Textarea label={t('form.notes.label')} placeholder={t('form.notes.placeholder')} minRows={5} {...form.getInputProps('notes')} readOnly={readOnly} />
            <AppAuthenticationCheck permissions={[{ scope: 'dates', action: 'edit' }]}>
              <SimpleGrid cols={2}>
                <Button size="lg" onClick={handleUpdate}>
                  {t('operations.update.title')}
                </Button>
                <Button size="lg" variant="light" color="red" onClick={handleDelete}>
                  {t('operations.delete.title')}
                </Button>
              </SimpleGrid>
            </AppAuthenticationCheck>
          </SimpleGrid>
        </form>
      </Modal>
      <div className={`${styles.container} ${readOnly && styles.readOnly} ${styles[`period${dateObj.period}`]} ${dateObj.is_holiday && styles.isHoliday} ${dateObj.notes && styles.hasNote}`} onClick={openModal}>
        {dayString}
      </div>
    </>
  );
}
