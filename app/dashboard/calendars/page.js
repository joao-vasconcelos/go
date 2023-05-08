'use client';

import { styled } from '@stitches/react';
import dayjs from 'dayjs';
import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import API from '../../../services/API';
import Pannel from '../../../layouts/Pannel';
import { useDisclosure } from '@mantine/hooks';
import { TextInput, ActionIcon, Modal, SegmentedControl, Menu, Checkbox, Switch, Select, Button, SimpleGrid, Divider, LoadingOverlay } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { TbCirclePlus, TbArrowBarToDown, TbDots } from 'react-icons/tb';
import notify from '../../../services/notify';
import FooterText from '../../../components/lists/FooterText';
import HorizontalCalendar from '../../../components/HorizontalCalendar/HorizontalCalendar';

const SearchField = styled(TextInput, {
  width: '100%',
});

export default function Page() {
  //

  //
  // A. Setup variables

  const router = useRouter();

  const [isModalPresented, { open: openModal, close: closeModal }] = useDisclosure(false);

  const [selectedCalendarType, setSelectedCalendarType] = useState('range');

  const [selectedDateRange, setSelectedDateRange] = useState();
  const [selectedDatesCollection, setSelectedDatesCollection] = useState();

  const [selectedDatesPeriod, setSelectedDatesPeriod] = useState(1);
  const [selectedDatesHoliday, setSelectedDatesHoliday] = useState(0);

  const [isCreating, setIsCreating] = useState(false);

  //
  // B. Fetch data

  const { data: datesData, error: datesError, isLoading: datesLoading, isValidating: datesValidating } = useSWR('/api/dates');

  //
  // C. Handle actions

  const handleCreateDates = async () => {
    try {
      //
      setIsCreating(true);

      let datesToCreate = [];

      switch (selectedCalendarType) {
        case 'range':
          let currentDate = dayjs(selectedDateRange[0]);
          const formattedEndDate = dayjs(selectedDateRange[1]).format('YYYYMMDD');
          while (currentDate.format('YYYYMMDD') <= formattedEndDate) {
            datesToCreate.push(currentDate.format('YYYYMMDD'));
            currentDate = currentDate.add(1, 'day');
          }
          break;
        case 'multiple':
          for (const currentDate of selectedDatesCollection) {
            datesToCreate.push(dayjs(currentDate).format('YYYYMMDD'));
          }
          break;
      }

      datesToCreate = datesToCreate.map((dateString) => {
        // Setup up the date as a dayjs object
        const date = dayjs(dateString, 'YYYYMMDD');
        // Create the date object
        return {
          date: dateString,
          period: selectedDatesPeriod,
          weekday_type: date.day(),
          holiday: selectedDatesHoliday > 0 ? true : false,
        };
      });

      await API({ service: 'dates', operation: 'create', method: 'POST', body: datesToCreate });
      notify('new', 'success', 'Datas criadas com sucesso.');
      closeModal();
      setIsCreating(false);
      setSelectedDateRange();
      setSelectedDatesCollection();
      //
    } catch (err) {
      setIsCreating(false);
      console.log(err);
      notify('new', 'error', err.message);
    }
  };

  const handleUpdateDate = () => {};

  const handleDeleteDate = () => {};

  //
  // D. Render components

  return (
    <Pannel
      loading={datesLoading}
      header={
        <>
          <ActionIcon onClick={openModal} variant='light' color='blue'>
            <TbCirclePlus size='20px' />
          </ActionIcon>
        </>
      }
      footer={<FooterText text={`Encontrada 1 Agência`} />}
    >
      <Modal opened={isModalPresented} onClose={closeModal} title='Authentication' size='auto' centered>
        <LoadingOverlay visible={isCreating} />
        <SimpleGrid cols={1}>
          <SegmentedControl
            value={selectedCalendarType}
            onChange={setSelectedCalendarType}
            data={[
              { value: 'range', label: 'Dias em Contínuo' },
              { value: 'multiple', label: 'Dias Avulso' },
            ]}
          />

          {/* <CustomDatePicker /> */}
          {selectedCalendarType === 'range' ? (
            <DatePicker type='range' value={selectedDateRange} onChange={setSelectedDateRange} numberOfColumns={3} />
          ) : (
            <DatePicker type='multiple' value={selectedDatesCollection} onChange={setSelectedDatesCollection} numberOfColumns={3} />
          )}

          <Divider label='Pré-definir atributos destas datas' labelPosition='center' />

          <SimpleGrid cols={2}>
            <Select
              label='Período'
              placeholder='Período'
              searchable
              nothingFound='Sem opções'
              value={selectedDatesPeriod}
              onChange={setSelectedDatesPeriod}
              data={[
                { value: 1, label: '1 - Período Escolar' },
                { value: 2, label: '2 - Período de Férias Escolares' },
                { value: 3, label: '3 - Período de Verão' },
              ]}
            />
            <Select
              label='Feriado'
              placeholder='Feriado'
              searchable
              nothingFound='Sem opções'
              value={selectedDatesHoliday}
              onChange={setSelectedDatesHoliday}
              data={[
                { value: 0, label: '0 - As datas escolhidas não são Feriado' },
                { value: 1, label: '1 - Definir estas datas como Feriado' },
              ]}
            />
          </SimpleGrid>
          <Button size='lg' onClick={handleCreateDates}>
            Adicionar estas datas
          </Button>
          <Button size='lg' color='red' onClick={handleCreateDates}>
            Eliminar estas datas
          </Button>
        </SimpleGrid>
      </Modal>
      <HorizontalCalendar datesData={datesData} onUpdateDate={handleUpdateDate} onDeleteDate={handleDeleteDate} />
    </Pannel>
  );
}
