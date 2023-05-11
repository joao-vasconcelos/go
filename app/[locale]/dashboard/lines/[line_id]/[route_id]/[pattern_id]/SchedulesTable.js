'use client';

import useSWR from 'swr';
import { styled } from '@stitches/react';
import { Select, ActionIcon, Flex, Checkbox, Badge, Tooltip, NumberInput, MultiSelect, TextInput, Button } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import { IconTrash } from '@tabler/icons-react';

const TableContainer = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr',
  //   flexDirection: 'column',
  //   width: '100%',
  gap: '1px',
  backgroundColor: '$gray4',
  border: '1px solid $gray4',
  overflow: 'scroll',
});

const TableRow = styled('div', {
  display: 'grid',
  gridTemplateColumns: '150px 1fr 1fr 100px 80px',
  alignItems: 'center',
  gap: '5px',
  //   width: '100%',
});

const TableHeader = styled(TableRow, {
  backgroundColor: '$gray3',
});

const TableBody = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '1px',
  width: '100%',
  //   backgroundColor: '$gray5',
});

const TableBodyRow = styled(TableRow, {
  backgroundColor: '$gray0',
  '&:hover': {
    backgroundColor: '$gray1',
  },
});

const TableCell = styled('div', {
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  padding: '$sm',
  fontSize: '14px',
  variants: {
    hcenter: {
      true: {
        justifyContent: 'center',
      },
    },
  },
});

const TableCellGrip = styled(TableCell, {
  color: '$gray6',
  transition: 'color 300ms ease',
  cursor: 'grab',
  '&:hover': {
    color: '$gray8',
  },
  '&:active': {
    color: '$gray8',
  },
});

const TableCellHeader = styled(TableCell, {
  minHeight: '25px',
  fontWeight: '$medium',
});

const TableCellBody = styled(TableCell, {
  minHeight: '20px',
});

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  //   alignItems: 'center',
  width: '100%',
  //   marginBottom: '$md',
  overflow: 'hidden',
  border: '1px solid $gray4',
  borderBottom: 'none',
  //   borderRadius: '$md',
  backgroundColor: '$gray0',
  transition: 'box-shadow 300ms ease, background-color 300ms ease',
  cursor: 'pointer',
  '&:hover': {
    // boxShadow: '$xs',
    backgroundColor: '$gray0',
  },
  '&:active': {
    backgroundColor: '$gray1',
  },
});

const Toolbar = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '$md',
  color: '$gray5',
  transition: 'color 300ms ease',
  '&:hover': {
    color: '$gray8',
  },
  '&:active': {
    color: '$gray8',
  },
});

const Wrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  width: '100%',
  gap: '$sm',
  padding: '$md',
});

const Text = styled('p', {
  lineHeight: '1',
  variants: {
    isUntitled: {
      true: {
        color: '$gray6',
        fontWeight: '$regular',
        fontStyle: 'italic',
      },
    },
  },
});

const Title = styled(Text, {
  fontSize: '18px',
  color: '$gray12',
  fontWeight: '$medium',
  lineHeight: '1',
});

const Subtitle = styled(Text, {
  fontSize: '14px',
  color: '$gray8',
  fontWeight: '$bold',
  lineHeight: '1',
});

export default function SchedulesTable({ form, onDelete }) {
  //

  // Fetch calendars
  const { data: calendarsData, error: calendarsError, isLoading: calendarsLoading } = useSWR('/api/calendars');

  //
  // Formatters

  //
  // Render components

  const StopSequenceHeader = () => (
    <TableHeader>
      <TableCellHeader>Hora de Início</TableCellHeader>
      <TableCellHeader>Calendários ON</TableCellHeader>
      <TableCellHeader>Calendários OFF</TableCellHeader>
      <TableCellHeader />
      <TableCellHeader />
    </TableHeader>
  );

  const StopSequenceFooter = () => (
    <TableHeader>
      <TableCellHeader />
      <TableCellHeader />
      <TableCellHeader />
      <TableCellHeader />
    </TableHeader>
  );

  return (
    <TableContainer>
      <StopSequenceHeader />
      <TableBody>
        {form.values.schedules.length > 0 ? (
          form.values.schedules.map((item, index) => (
            <TableBodyRow key={index}>
              <TableCellBody hcenter>
                <TimeInput withSeconds aria-label='star_time' {...form.getInputProps(`schedules.${index}.start_time`)} w={'100%'} />
              </TableCellBody>
              <TableCellBody>
                <MultiSelect
                  aria-label='Calendário'
                  placeholder='Calendário'
                  searchable
                  nothingFound='Sem opções'
                  w={'100%'}
                  {...form.getInputProps(`schedules.${index}.calendars_on`)}
                  data={
                    calendarsData
                      ? calendarsData.map((calendar) => {
                          return { value: calendar._id, label: `[${calendar.code}] ${calendar.name || 'Calendário sem Nome'}`, disabled: form.values.schedules[index].calendars_off.includes(calendar._id) };
                        })
                      : []
                  }
                />
              </TableCellBody>
              <TableCellBody>
                <MultiSelect
                  aria-label='Calendário'
                  placeholder='Calendário'
                  searchable
                  nothingFound='Sem opções'
                  w={'100%'}
                  {...form.getInputProps(`schedules.${index}.calendars_off`)}
                  data={
                    calendarsData
                      ? calendarsData.map((calendar) => {
                          return { value: calendar._id, label: `[${calendar.code}] ${calendar.name || 'Calendário sem Nome'}`, disabled: form.values.schedules[index].calendars_on.includes(calendar._id) };
                        })
                      : []
                  }
                />
              </TableCellBody>
              <TableCellBody hcenter>
                <Button size='xs' disabled>
                  Ajustes
                </Button>
              </TableCellBody>
              <TableCellBody hcenter>
                <Flex>
                  <ActionIcon size='lg' color='red' onClick={() => onDelete(index)}>
                    <IconTrash size='20px' />
                  </ActionIcon>
                </Flex>
              </TableCellBody>
            </TableBodyRow>
          ))
        ) : (
          <TableRow>
            <TableBody>
              <TableCellBody>Nenhuma Linha Selecionada</TableCellBody>
            </TableBody>
          </TableRow>
        )}
      </TableBody>
      <StopSequenceFooter />
    </TableContainer>
  );

  //
}