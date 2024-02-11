'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { useRouter } from '@/translations/navigation';
import API from '@/services/API';
import Pannel from '@/components/Pannel/Pannel';
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, ActionIcon, Tooltip, Switch } from '@mantine/core';
import { SegmentedControl, Select, SimpleGrid, Divider } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useTranslations } from 'next-intl';
import { useForm } from '@mantine/form';
import { IconCalendarPlus, IconChevronLeft } from '@tabler/icons-react';
import notify from '@/services/notify';
import Text from '@/components/Text/Text';
import HCalendar from '@/components/HCalendar/HCalendar';
import HCalendarPeriodCard from '@/components/HCalendarPeriodCard/HCalendarPeriodCard';
import Loader from '@/components/Loader/Loader';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import AuthGate, { isAllowed } from '@/components/AuthGate/AuthGate';
import calculateDateDayType from '@/services/calculateDateDayType';
import { openConfirmModal } from '@mantine/modals';
import ListHeader from '@/components/ListHeader/ListHeader';

export default function Page() {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const t = useTranslations('dates');
  const [isModalPresented, { open: openModal, close: closeModal }] = useDisclosure(false);
  const { data: session } = useSession();
  const isReadOnly = !isAllowed(session, 'dates', 'create_edit');

  const [selectedCalendarType, setSelectedCalendarType] = useState('range');
  const [selectedDateRange, setSelectedDateRange] = useState([]);
  const [selectedDatesCollection, setSelectedDatesCollection] = useState([]);

  const [isUpdatingDates, setIsUpdatingDates] = useState(false);

  //
  // B. Setup form

  const form = useForm({
    initialValues: { period: '1', is_holiday: false },
  });

  //
  // C. Fetch data

  const { data: allDatesData, isLoading: allDatesLoading, mutate: allDatesMutate } = useSWR('/api/dates');

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
      return {
        date: dateString,
        period: form.values.period,
        day_type: calculateDateDayType(dateString, form.values.is_holiday),
        is_holiday: form.values.is_holiday,
      };
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
      allDatesMutate();
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

  const handleDelete = () => {
    closeModal();
    openConfirmModal({
      title: <Text size="h2">{t('operations.delete.title')}</Text>,
      centered: true,
      closeOnClickOutside: true,
      children: <Text size="h3">{t('operations.delete.description')}</Text>,
      labels: { confirm: t('operations.delete.confirm'), cancel: t('operations.delete.cancel') },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          setIsUpdatingDates(true);
          notify('delete', 'loading', t('operations.delete.loading'));
          const formattedDateObjects = formatSelectedDates();
          await API({ service: 'dates', operation: 'delete', method: 'POST', body: formattedDateObjects });
          allDatesMutate();
          notify('delete', 'success', t('operations.delete.success'));
          setIsUpdatingDates(false);
          closeModal();
        } catch (err) {
          console.log(err);
          setIsUpdatingDates(false);
          notify('delete', 'error', err.message || t('operations.delete.error'));
        }
      },
      onCancel: openModal(),
    });
  };

  //
  // D. Render components

  const renderDateCardComponent = ({ key, ...props }) => {
    return <HCalendarPeriodCard key={key} {...props} readOnly={isReadOnly} />;
  };

  //
  // D. Render components

  return (
    <Pannel
      loading={allDatesLoading}
      header={
        <ListHeader>
          <Tooltip label={t('operations.close.title')} color="gray" position="bottom" withArrow>
            <ActionIcon color="gray" variant="subtle" size="lg" onClick={() => router.push('/calendars')}>
              <IconChevronLeft size={20} />
            </ActionIcon>
          </Tooltip>
          <Text size="h1" full>
            {t('title')}
          </Text>
          <AuthGate scope="dates" permission="create_edit">
            <Button leftSection={<IconCalendarPlus size={20} />} onClick={openModal} variant="light" color="blue" size="sm">
              {t('operations.manage.title')}
            </Button>
          </AuthGate>
        </ListHeader>
      }
    >
      <Modal opened={isModalPresented} onClose={closeModal} title={t('operations.manage.title')} size="auto" centered>
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

            {selectedCalendarType === 'range' ? <DatePicker type="range" value={selectedDateRange} onChange={setSelectedDateRange} numberOfColumns={3} /> : <DatePicker type="multiple" value={selectedDatesCollection} onChange={setSelectedDatesCollection} numberOfColumns={3} />}

            <Divider />

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
                readOnly={isReadOnly}
                searchable
              />
              <Switch label={t('form.is_holiday.label')} description={t('form.is_holiday.description')} {...form.getInputProps('is_holiday')} readOnly={isReadOnly} />
            </SimpleGrid>
            <SimpleGrid cols={2}>
              <Button size="lg" onClick={handleUpdate} disabled={!isSelectionValid()}>
                {t('operations.update.title')}
              </Button>
              <AuthGate scope="dates" permission="delete">
                <Button size="lg" color="red" onClick={handleDelete} disabled={!isSelectionValid()}>
                  {t('operations.delete.title')}
                </Button>
              </AuthGate>
            </SimpleGrid>
          </SimpleGrid>
        </form>
      </Modal>
      <HCalendar availableDates={allDatesData} renderCardComponent={renderDateCardComponent} />
    </Pannel>
  );
}
