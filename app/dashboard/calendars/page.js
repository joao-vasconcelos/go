'use client';

import { useState } from 'react';
import useSWR from 'swr';
import API from '../../../services/API';
import Pannel from '../../../components/Pannel/Pannel';
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, LoadingOverlay } from '@mantine/core';
import { TbCalendarPlus } from 'react-icons/tb';
import notify from '../../../services/notify';
import HCalendar from '../../../components/HCalendar/HCalendar';
import AddDatesCalendar from '../../../components/AddDatesCalendar/AddDatesCalendar';
import HCalendarPeriodCard from '../../../components/HCalendarPeriodCard/HCalendarPeriodCard';

export default function Page() {
  //

  //
  // A. Setup variables

  const [isModalPresented, { open: openModal, close: closeModal }] = useDisclosure(false);

  const [isUpdatingDates, setIsUpdatingDates] = useState(false);

  //
  // B. Fetch data

  const { data: datesData, error: datesError, isLoading: datesLoading, isValidating: datesValidating } = useSWR('/api/dates');

  //
  // C. Handle actions

  const handleUpdateDates = async (dateObjects) => {
    try {
      setIsUpdatingDates(true);
      await API({ service: 'dates', operation: 'create', method: 'POST', body: dateObjects });
      notify('new', 'success', 'Datas criadas com sucesso.');
      setIsUpdatingDates(false);
      closeModal();
    } catch (err) {
      setIsUpdatingDates(false);
      console.log(err);
      notify('new', 'error', err.message);
    }
  };

  const handleDeleteDates = async (dateObjects) => {
    try {
      setIsUpdatingDates(true);
      await API({ service: 'dates', operation: 'delete', method: 'POST', body: dateObjects });
      notify('delete', 'success', 'Datas eliminadas com sucesso.');
      setIsUpdatingDates(false);
      closeModal();
    } catch (err) {
      setIsUpdatingDates(false);
      console.log(err);
      notify('delete', 'error', err.message);
    }
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
        <Button leftIcon={<TbCalendarPlus size='20px' />} onClick={openModal} variant='light' color='blue' size='sm'>
          Gerir Datas
        </Button>
      }
    >
      <Modal opened={isModalPresented} onClose={closeModal} title='Gerir Datas' size='auto' centered>
        <LoadingOverlay visible={isUpdatingDates} />
        <AddDatesCalendar onUpdate={handleUpdateDates} onDelete={handleDeleteDates} />
      </Modal>
      <HCalendar availableDates={datesData} renderCardComponent={renderDateCardComponent} />
    </Pannel>
  );
}
