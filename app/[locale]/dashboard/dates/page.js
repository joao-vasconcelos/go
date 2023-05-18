'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import API from '../../../../services/API';
import Pannel from '../../../../components/Pannel/Pannel';
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, ActionIcon, Tooltip } from '@mantine/core';
import { SegmentedControl, Select, SimpleGrid, Divider } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useTranslations } from 'next-intl';
import { useForm } from '@mantine/form';
import { IconCalendarPlus, IconChevronLeft } from '@tabler/icons-react';
import notify from '../../../../services/notify';
import Text from '../../../../components/Text/Text';
import HCalendar from '../../../../components/HCalendar/HCalendar';
import HCalendarPeriodCard from '../../../../components/HCalendarPeriodCard/HCalendarPeriodCard';
import Loader from '../../../../components/Loader/Loader';
import dayjs from 'dayjs';
import AuthGate from '../../../../components/AuthGate/AuthGate';

export default function Page() {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const t = useTranslations('dates');
  const [isModalPresented, { open: openModal, close: closeModal }] = useDisclosure(false);

  const [selectedCalendarType, setSelectedCalendarType] = useState('range');
  const [selectedDateRange, setSelectedDateRange] = useState([]);
  const [selectedDatesCollection, setSelectedDatesCollection] = useState([]);

  const [isUpdatingDates, setIsUpdatingDates] = useState(false);

  //
  // B. Setup form

  const form = useForm({
    initialValues: { period: 1 },
  });

  //
  // C. Fetch data

  const { data: datesData, error: datesError, isLoading: datesLoading, isValidating: datesValidating } = useSWR('/api/dates');

  //
  // C. Helper functions

  const isSelectionValid = () => {
    switch (selectedCalendarType) {
      case 'range':
        // Has correct length of two
        if (selectedDateRange && selectedDateRange.length != 2) return false;
        // Both values are not null
        else if (selectedDateRange[0] === null || selectedDateRange[1] === null) return false;
        // Return true otherwise
        else return true;
      case 'multiple':
        return selectedDatesCollection.length > 0;
    }
  };

  const formatSelectedDates = () => {
    // Initiate variable to hold date objects
    let formattedDates = [];
    // Depending on the selection mode
    switch (selectedCalendarType) {
      case 'range':
        let currentDate = dayjs(selectedDateRange[0]);
        const formattedEndDate = dayjs(selectedDateRange[1]).format('YYYYMMDD');
        while (currentDate.format('YYYYMMDD') <= formattedEndDate) {
          formattedDates.push(currentDate.format('YYYYMMDD'));
          currentDate = currentDate.add(1, 'day');
        }
        break;
      case 'multiple':
        for (const currentDate of selectedDatesCollection) {
          formattedDates.push(dayjs(currentDate).format('YYYYMMDD'));
        }
        break;
    }
    // Return the created date objects
    return formattedDates.map((dateString) => {
      return { date: dateString, period: form.values.period };
    });
  };

  //
  // C. Handle actions

  const handleUpdate = async () => {
    try {
      setIsUpdatingDates(true);
      notify('update', 'loading', t('operations.update.loading'));
      const formattedDateObjects = formatSelectedDates();
      await API({ service: 'dates', operation: 'create', method: 'POST', body: formattedDateObjects });
      notify('update', 'success', t('operations.update.loading'));
      setSelectedDateRange([]);
      setSelectedDatesCollection([]);
      setIsUpdatingDates(false);
      closeModal();
    } catch (err) {
      console.log(err);
      setIsUpdatingDates(false);
      notify('update', 'error', t('operations.update.error'));
    }
  };

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
          setIsUpdatingDates(true);
          notify('delete', 'loading', t('operations.delete.loading'));
          const formattedDateObjects = formatSelectedDates();
          await API({ service: 'dates', operation: 'delete', method: 'POST', body: formattedDateObjects });
          notify('delete', 'success', t('operations.delete.success'));
          setIsUpdatingDates(false);
          closeModal();
        } catch (err) {
          console.log(err);
          setIsUpdatingDates(false);
          notify('delete', 'error', err.message || t('operations.delete.error'));
        }
      },
    });
  };

  //
  // D. Render components

  const renderDateCardComponent = ({ key, ...props }) => {
    return <HCalendarPeriodCard key={key} {...props} />;
  };

  //
  // D. Render components

  return (
    <Pannel
      loading={datesLoading}
      header={
        <>
          <Tooltip label={t('operations.close.title')} color='gray' position='bottom' withArrow>
            <ActionIcon color='gray' variant='subtle' size='lg' onClick={() => router.push('/dashboard/calendars')}>
              <IconChevronLeft size='20px' />
            </ActionIcon>
          </Tooltip>
          <Text size='h1' full>
            {t('title')}
          </Text>
          <AuthGate permission='dates_edit'>
            <Button leftIcon={<IconCalendarPlus size='20px' />} onClick={openModal} variant='light' color='blue' size='sm'>
              {t('operations.manage.title')}
            </Button>
          </AuthGate>
        </>
      }
    >
      <Modal opened={isModalPresented} onClose={closeModal} title={t('operations.manage.title')} size='auto' centered>
        <Loader visible={isUpdatingDates} full />
        <form onSubmit={form.onSubmit(handleUpdate)}>
          <SimpleGrid cols={1}>
            <SegmentedControl
              value={selectedCalendarType}
              onChange={setSelectedCalendarType}
              data={[
                { value: 'range', label: t('form.range.title') },
                { value: 'multiple', label: t('form.multiple.title') },
              ]}
            />

            {selectedCalendarType === 'range' ? (
              <DatePicker type='range' value={selectedDateRange} onChange={setSelectedDateRange} numberOfColumns={3} />
            ) : (
              <DatePicker type='multiple' value={selectedDatesCollection} onChange={setSelectedDatesCollection} numberOfColumns={3} />
            )}

            <Divider />

            <SimpleGrid cols={1}>
              <Select
                label={t('form.period.label')}
                placeholder={t('form.period.placeholder')}
                nothingFound={t('form.period.nothingFound')}
                data={[
                  { value: 1, label: '1 - Período Escolar' },
                  { value: 2, label: '2 - Período de Férias Escolares' },
                  { value: 3, label: '3 - Período de Verão' },
                ]}
                {...form.getInputProps('period')}
                searchable
              />
            </SimpleGrid>
            <SimpleGrid cols={2}>
              <Button size='lg' onClick={handleUpdate} disabled={!isSelectionValid()}>
                {t('operations.update.title')}
              </Button>
              <Button size='lg' color='red' onClick={handleDelete} disabled={!isSelectionValid()}>
                {t('operations.delete.title')}
              </Button>
            </SimpleGrid>
          </SimpleGrid>
        </form>
      </Modal>
      <HCalendar availableDates={datesData} renderCardComponent={renderDateCardComponent} />
    </Pannel>
  );
}
