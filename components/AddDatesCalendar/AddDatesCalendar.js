'use client';

import dayjs from 'dayjs';
import { useState } from 'react';
import { useForm } from '@mantine/form';
import { SegmentedControl, Select, Button, SimpleGrid, LoadingOverlay, Textarea, Divider } from '@mantine/core';
import { DatePicker } from '@mantine/dates';

export default function AddDatesCalendar({ onUpdate, onDelete }) {
  //

  //
  // A. Setup variables

  const [selectedCalendarType, setSelectedCalendarType] = useState('range');
  const [selectedDateRange, setSelectedDateRange] = useState([]);
  const [selectedDatesCollection, setSelectedDatesCollection] = useState([]);
  const [isFormatting, setIsFormatting] = useState(false);

  //
  // C. Handle actions

  const form = useForm({
    initialValues: { period: 1, comment: '' },
  });

  //
  // C. Handle actions

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
    //
    setIsFormatting(true);

    let formattedDates = [];

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

    formattedDates = formattedDates.map((dateString) => {
      // Create the date object
      return {
        date: dateString,
        period: form.values.period,
        comment: form.values.comment,
      };
    });

    setIsFormatting(false);
    setSelectedDateRange([]);
    setSelectedDatesCollection([]);

    return formattedDates;
  };

  const handleUpdate = () => {
    const formattedDateObjects = formatSelectedDates();
    onUpdate(formattedDateObjects);
  };

  const handleDelete = () => {
    const formattedDateObjects = formatSelectedDates();
    onDelete(formattedDateObjects);
  };

  //
  // D. Render components

  return (
    <form onSubmit={form.onSubmit(handleUpdate)}>
      <LoadingOverlay visible={isFormatting} />
      <SimpleGrid cols={1}>
        <SegmentedControl
          value={selectedCalendarType}
          onChange={setSelectedCalendarType}
          data={[
            { value: 'range', label: 'Dias em Contínuo' },
            { value: 'multiple', label: 'Dias Avulso' },
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
            label='Período'
            placeholder='Período'
            searchable
            nothingFound='Sem opções'
            {...form.getInputProps('period')}
            data={[
              { value: 1, label: '1 - Período Escolar' },
              { value: 2, label: '2 - Período de Férias Escolares' },
              { value: 3, label: '3 - Período de Verão' },
            ]}
          />
          <Textarea label='Notas sobre estas datas' {...form.getInputProps('notes')} />
        </SimpleGrid>
        <SimpleGrid cols={2}>
          <Button size='lg' onClick={handleUpdate} disabled={!isSelectionValid()}>
            Atualizar Datas
          </Button>
          <Button size='lg' color='red' onClick={handleDelete} disabled={!isSelectionValid()}>
            Eliminar Datas
          </Button>
        </SimpleGrid>
      </SimpleGrid>
    </form>
  );
}
