'use client';

import useSWR from 'swr';
import { styled } from '@stitches/react';
import { Select, ActionIcon, Flex, Checkbox, Badge, Tooltip, NumberInput, MultiSelect } from '@mantine/core';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { TbSortAscendingNumbers, TbX, TbArrowBarUp, TbClockPause, TbEqual, TbPlayerTrackNext, TbArrowBarToDown, TbArrowAutofitContent, TbTrash, TbChevronDown, TbClockHour4, TbChevronRight, TbGripVertical } from 'react-icons/tb';

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
  gridTemplateColumns: '40px 40px 300px 40px 40px 200px 40px 180px 40px 180px 180px 500px 70px',
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

export default function StopSequenceTable({ form, onReorder, onDelete }) {
  //

  // Fetch stops
  const { data: stopsData, error: stopsError, isLoading: stopsLoading } = useSWR('/api/stops');

  //
  // Formatters

  const formatMetersToDistance = (distanceInMeters) => {
    if (distanceInMeters >= 1000) {
      const distanceInKm = Math.floor(distanceInMeters / 1000);
      const remainderInMeters = distanceInMeters % 1000;
      return `${distanceInKm} km ${remainderInMeters} metros`;
    } else {
      return distanceInMeters + ' metros';
    }
  };

  const formatSecondsToTime = (timeInSeconds) => {
    if (timeInSeconds < 60) {
      return timeInSeconds + ' seg';
    } else if (timeInSeconds < 3600) {
      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = timeInSeconds % 60;
      return `${minutes}m:${seconds}s`;
    } else {
      const hours = Math.floor(timeInSeconds / 3600);
      const minutes = Math.floor((timeInSeconds % 3600) / 60);
      const seconds = timeInSeconds % 60;
      return `${hours} h ${minutes} min ${seconds} seg`;
    }
  };

  function calculateTravelTime(distanceInMeters, speedInKmPerHour) {
    if (speedInKmPerHour === 0 || distanceInMeters === 0) {
      return 0;
    }
    const speedInMetersPerSecond = (speedInKmPerHour * 1000) / 3600;
    const travelTimeInSeconds = distanceInMeters / speedInMetersPerSecond;
    return travelTimeInSeconds || 0;
  }

  //
  // Render components

  const StopSequenceHeader = () => (
    <TableHeader>
      <TableCellHeader />
      <TableCellHeader hcenter>
        <TbSortAscendingNumbers size='20px' />
      </TableCellHeader>
      <TableCellHeader>Paragem</TableCellHeader>
      <TableCellHeader hcenter>
        <TbArrowBarToDown size='20px' />
      </TableCellHeader>
      <TableCellHeader hcenter>
        <TbArrowBarUp size='20px' />
      </TableCellHeader>
      <TableCellHeader>Distância entre paragens</TableCellHeader>
      <TableCellHeader />
      <TableCellHeader>Velocidade Comercial no troço</TableCellHeader>
      <TableCellHeader />
      <TableCellHeader>default_travel_time</TableCellHeader>
      <TableCellHeader>Dwell Time</TableCellHeader>
      <TableCellHeader>apex</TableCellHeader>
      <TableCellHeader />
    </TableHeader>
  );

  const StopSequenceRow = () => <div></div>;

  return (
    <DragDropContext onDragEnd={onReorder}>
      <Droppable droppableId='droppable'>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            <TableContainer>
              <StopSequenceHeader />
              <TableBody>
                {form.values.path.length > 0 ? (
                  form.values.path.map((item, index) => (
                    <Draggable key={index} draggableId={index.toString()} index={index}>
                      {(provided) => (
                        <TableBodyRow ref={provided.innerRef} {...provided.draggableProps}>
                          <TableCellGrip hcenter {...provided.dragHandleProps}>
                            <TbGripVertical size='20px' />
                          </TableCellGrip>
                          <TableCellBody hcenter>
                            <Title>{index}</Title>
                          </TableCellBody>
                          <TableCellBody>
                            <Select
                              aria-label='Paragem'
                              placeholder='Paragem'
                              searchable
                              nothingFound='Sem opções'
                              w={'100%'}
                              {...form.getInputProps(`path.${index}.stop_id`)}
                              data={
                                stopsData
                                  ? stopsData.map((item) => {
                                      return { value: item._id, label: `${item.stop_name || 'Stop sem Nome'} (${item.stop_code})` };
                                    })
                                  : []
                              }
                            />
                          </TableCellBody>
                          <TableCellBody hcenter>
                            <Tooltip label='Permite embarque nesta paragem' position='bottom' withArrow>
                              <Checkbox size='sm' {...form.getInputProps(`path.${index}.allow_pickup`, { type: 'checkbox' })} />
                            </Tooltip>
                          </TableCellBody>
                          <TableCellBody hcenter>
                            <Tooltip label='Permite desembarque nesta paragem' position='bottom' withArrow>
                              <Checkbox size='sm' {...form.getInputProps(`path.${index}.allow_drop_off`, { type: 'checkbox' })} />
                            </Tooltip>
                          </TableCellBody>
                          <TableCellBody>
                            <Tooltip label='Distância percorrida desde a paragem anterior até à atual, em metros. (x metros são y km)' position='bottom' width='300px' multiline withArrow>
                              <NumberInput
                                aria-label='distance_delta'
                                placeholder='distance_delta'
                                defaultValue={0}
                                min={0}
                                step={10}
                                stepHoldDelay={500}
                                stepHoldInterval={100}
                                formatter={formatMetersToDistance}
                                icon={<TbArrowAutofitContent size='20px' />}
                                {...form.getInputProps(`path.${index}.distance_delta`)}
                                disabled={index === 0}
                                value={index === 0 ? 0 : form.values.path[index].distance_delta}
                              />
                            </Tooltip>
                          </TableCellBody>
                          <TableCellBody>
                            <TbX size='20px' />
                          </TableCellBody>
                          <TableCellBody>
                            <Tooltip label='Velocidade comercial no troço.' position='bottom' withArrow>
                              <NumberInput
                                aria-label='default_travel_time'
                                placeholder='default_travel_time'
                                defaultValue={20}
                                min={0}
                                step={10}
                                stepHoldDelay={500}
                                stepHoldInterval={100}
                                formatter={(value) => `${value} km/h`}
                                icon={<TbPlayerTrackNext size='18px' />}
                                {...form.getInputProps(`path.${index}.default_velocity`)}
                                disabled={index === 0}
                                value={index === 0 ? 0 : form.values.path[index].default_velocity}
                              />
                            </Tooltip>
                          </TableCellBody>
                          <TableCellBody>
                            <TbEqual size='30px' />
                          </TableCellBody>
                          <TableCellBody>
                            <Tooltip label='Tempo estimado de viagem no troço.' position='bottom' withArrow>
                              <NumberInput
                                aria-label='default_travel_time'
                                placeholder='default_travel_time'
                                formatter={formatSecondsToTime}
                                icon={<TbClockHour4 size='18px' />}
                                readOnly
                                {...form.getInputProps(`path.${index}.default_travel_time`)}
                                disabled={index === 0}
                                value={calculateTravelTime(form.values.path[index].distance_delta, form.values.path[index].default_velocity)}
                              />
                            </Tooltip>
                          </TableCellBody>
                          <TableCellBody>
                            <Tooltip label='Tempo estimado para entrada e saída de passagairos, em segundos. (${segundos} são ${segundos/60} minutos)' position='bottom' width='300px' multiline withArrow>
                              <NumberInput
                                aria-label='Default wait time'
                                placeholder='Default wait time'
                                defaultValue={30}
                                min={0}
                                max={900}
                                step={10}
                                stepHoldDelay={500}
                                stepHoldInterval={100}
                                icon={<TbClockPause size='20px' />}
                                formatter={formatSecondsToTime}
                                {...form.getInputProps(`path.${index}.default_dwell_time`)}
                              />
                            </Tooltip>
                          </TableCellBody>
                          <TableCellBody>
                            <MultiSelect
                              w='100%'
                              aria-label='Passes aceites'
                              placeholder='Passes aceites'
                              searchable
                              nothingFound='Sem opções'
                              data={['navegante Metropolitano', 'Alcochete', 'Almada', 'etc']}
                              {...form.getInputProps(`path.${index}.apex`)}
                            />
                          </TableCellBody>
                          <TableCellBody hcenter>
                            <Flex>
                              <ActionIcon size='lg' color='red' onClick={() => onDelete(index)}>
                                <TbTrash size='20px' />
                              </ActionIcon>
                            </Flex>
                          </TableCellBody>
                        </TableBodyRow>
                      )}
                    </Draggable>
                  ))
                ) : (
                  <TableRow>
                    <TableBody>
                      <TableCellBody>Nenhuma Linha Selecionada</TableCellBody>
                    </TableBody>
                  </TableRow>
                )}
                {provided.placeholder}
              </TableBody>
            </TableContainer>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );

  //
}
