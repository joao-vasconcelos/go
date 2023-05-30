'use client';

import styles from './HCalendarPeriodCard.module.css';
import { useState } from 'react';
import API from '../../services/API';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { useTranslations } from 'next-intl';
import { Modal, SimpleGrid, Textarea, Select, Button, LoadingOverlay } from '@mantine/core';
import dayjs from 'dayjs';
import Loader from '../Loader/Loader';
import notify from '../../services/notify';
import AuthGate, { isAllowed } from '../AuthGate/AuthGate';
import { useSession } from 'next-auth/react';

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
    initialValues: dateObj,
  });

  //
  // B. Render components

  const handleUpdate = async () => {
    try {
      setIsUpdating(true);
      await API({ service: 'dates', resourceId: dateObj._id, operation: 'edit', method: 'PUT', body: form.values });
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
      <Modal opened={isModalPresented} onClose={closeModal} title={fullDateString} size='500px' centered>
        <form onSubmit={form.onSubmit(handleUpdate)}>
          <LoadingOverlay visible={isUpdating} />
          <SimpleGrid cols={1}>
            <Select
              label={t('form.period.label')}
              placeholder={t('form.period.placeholder')}
              nothingFound={t('form.period.nothingFound')}
              {...form.getInputProps('period')}
              data={[
                { value: 1, label: '1 - Período Escolar' },
                { value: 2, label: '2 - Período de Férias Escolares' },
                { value: 3, label: '3 - Período de Verão' },
              ]}
              readOnly={readOnly}
              searchable
            />
            <Textarea label={t('form.notes.label')} placeholder={t('form.notes.placeholder')} minRows={5} {...form.getInputProps('notes')} readOnly={readOnly} />
            <AuthGate permission='dates_edit'>
              <SimpleGrid cols={2}>
                <Button size='lg' onClick={handleUpdate}>
                  {t('operations.update.title')}
                </Button>
                <Button size='lg' variant='light' color='red' onClick={handleDelete}>
                  {t('operations.delete.title')}
                </Button>
              </SimpleGrid>
            </AuthGate>
          </SimpleGrid>
        </form>
      </Modal>
      <div className={`${styles.container} ${readOnly && styles.readOnly} ${styles[`period${dateObj.period}`]} ${dateObj.notes && styles.hasNote}`} onClick={openModal}>
        {dayString}
      </div>
    </>
  );
}
