'use client';

import useSWR from 'swr';
import styles from './StopSequenceTable.module.css';
import { Select, ActionIcon, Flex, Checkbox, Tooltip, NumberInput, MultiSelect } from '@mantine/core';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { IconSortAscendingNumbers, IconX, IconArrowBarUp, IconClockPause, IconEqual, IconPlayerTrackNext, IconArrowBarToDown, IconArrowAutofitContent, IconTrash, IconClockHour4, IconGripVertical } from '@tabler/icons-react';

export default function StopSequenceTable({ form, onReorder, onDelete }) {
  //

  // Fetch stops
  const { data: allStopsData } = useSWR('/api/stops');

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
      return `${minutes} min ${seconds} seg`;
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
    <div className={styles.tableHeaderRow}>
      <div className={styles.tableHeaderCell} />
      <div className={`${styles.tableHeaderCell} ${styles.hcenter}`}>
        <IconSortAscendingNumbers size='20px' />
      </div>
      <div className={styles.tableHeaderCell}>Paragem</div>
      <div className={`${styles.tableHeaderCell} ${styles.hcenter}`}>
        <IconArrowBarToDown size='20px' />
      </div>
      <div className={`${styles.tableHeaderCell} ${styles.hcenter}`}>
        <IconArrowBarUp size='20px' />
      </div>
      <div className={styles.tableHeaderCell}>Distância entre paragens</div>
      <div className={styles.tableHeaderCell} />
      <div className={styles.tableHeaderCell}>Velocidade Comercial no troço</div>
      <div className={styles.tableHeaderCell} />
      <div className={styles.tableHeaderCell}>default_travel_time</div>
      <div className={styles.tableHeaderCell}>Dwell Time</div>
      <div className={styles.tableHeaderCell}>apex</div>
      <div className={styles.tableHeaderCell} />
    </div>
  );

  const StopSequenceFooter = () => (
    <div className={styles.tableHeaderRow}>
      <div className={styles.tableHeaderCell} />
      <div className={styles.tableHeaderCell} />
      <div className={styles.tableHeaderCell} />
      <div className={styles.tableHeaderCell} />
      <div className={styles.tableHeaderCell} />
      <div className={styles.tableHeaderCell} />
      <div className={styles.tableHeaderCell} />
      <div className={styles.tableHeaderCell}>AVG Vel Med</div>
      <div className={styles.tableHeaderCell} />
      <div className={styles.tableHeaderCell}>∑ = sjnjds</div>
      <div className={styles.tableHeaderCell}>tempo total parado</div>
      <div className={styles.tableHeaderCell} />
      <div className={styles.tableHeaderCell} />
    </div>
  );

  return (
    <DragDropContext onDragEnd={onReorder}>
      <Droppable droppableId='droppable'>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            <div className={styles.container}>
              <StopSequenceHeader />
              <div className={styles.rowWrapper}>
                {form.values.path.length > 0 ? (
                  form.values.path.map((item, index) => (
                    <Draggable key={index} draggableId={index.toString()} index={index}>
                      {(provided) => (
                        <div className={styles.tableBodyRow} ref={provided.innerRef} {...provided.draggableProps}>
                          <div className={`${styles.tableCellGrip} ${styles.hcenter}`} {...provided.dragHandleProps}>
                            <IconGripVertical size='20px' />
                          </div>
                          <div className={`${styles.tableBodyCell} ${styles.hcenter}`}>
                            <div className={styles.sequenceIndex}>{index}</div>
                          </div>
                          <div className={styles.tableBodyCell}>
                            <Select
                              aria-label='Paragem'
                              placeholder='Paragem'
                              searchable
                              nothingFound='Sem opções'
                              w={'100%'}
                              {...form.getInputProps(`path.${index}.stop_id`)}
                              data={
                                allStopsData
                                  ? allStopsData.map((item) => {
                                      return { value: item._id, label: `[${item.code}] ${item.name || 'Stop sem Nome'}` };
                                    })
                                  : []
                              }
                            />
                          </div>
                          <div className={`${styles.tableBodyCell} ${styles.hcenter}`}>
                            <Tooltip label='Permite embarque nesta paragem' position='bottom' withArrow>
                              <Checkbox size='sm' {...form.getInputProps(`path.${index}.allow_pickup`, { type: 'checkbox' })} />
                            </Tooltip>
                          </div>
                          <div className={`${styles.tableBodyCell} ${styles.hcenter}`}>
                            <Tooltip label='Permite desembarque nesta paragem' position='bottom' withArrow>
                              <Checkbox size='sm' {...form.getInputProps(`path.${index}.allow_drop_off`, { type: 'checkbox' })} />
                            </Tooltip>
                          </div>
                          <div className={styles.tableBodyCell}>
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
                                icon={<IconArrowAutofitContent size='20px' />}
                                {...form.getInputProps(`path.${index}.distance_delta`)}
                                disabled={index === 0}
                                value={index === 0 ? 0 : form.values.path[index].distance_delta}
                              />
                            </Tooltip>
                          </div>
                          <div className={styles.tableBodyCell}>
                            <IconX size='20px' />
                          </div>
                          <div className={styles.tableBodyCell}>
                            <Tooltip label='Velocidade comercial no troço.' position='bottom' withArrow>
                              <NumberInput
                                aria-label='default_travel_time'
                                placeholder='default_travel_time'
                                defaultValue={20}
                                min={0}
                                step={5}
                                stepHoldDelay={500}
                                stepHoldInterval={100}
                                formatter={(value) => `${value} km/h`}
                                icon={<IconPlayerTrackNext size='18px' />}
                                {...form.getInputProps(`path.${index}.default_velocity`)}
                                disabled={index === 0}
                                value={index === 0 ? 0 : form.values.path[index].default_velocity}
                              />
                            </Tooltip>
                          </div>
                          <div className={styles.tableBodyCell}>
                            <IconEqual size='30px' />
                          </div>
                          <div className={styles.tableBodyCell}>
                            <Tooltip label='Tempo estimado de viagem no troço.' position='bottom' withArrow>
                              <NumberInput
                                aria-label='default_travel_time'
                                placeholder='default_travel_time'
                                formatter={formatSecondsToTime}
                                icon={<IconClockHour4 size='18px' />}
                                readOnly
                                {...form.getInputProps(`path.${index}.default_travel_time`)}
                                disabled={index === 0}
                                value={calculateTravelTime(form.values.path[index].distance_delta, form.values.path[index].default_velocity)}
                              />
                            </Tooltip>
                          </div>
                          <div className={styles.tableBodyCell}>
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
                                icon={<IconClockPause size='20px' />}
                                formatter={formatSecondsToTime}
                                {...form.getInputProps(`path.${index}.default_dwell_time`)}
                              />
                            </Tooltip>
                          </div>
                          <div className={styles.tableBodyCell}>
                            <MultiSelect
                              w='100%'
                              aria-label='Passes aceites'
                              placeholder='Passes aceites'
                              searchable
                              nothingFound='Sem opções'
                              data={['navegante Metropolitano', 'Alcochete', 'Almada', 'etc']}
                              {...form.getInputProps(`path.${index}.apex`)}
                            />
                          </div>
                          <div className={`${styles.tableBodyCell} ${styles.hcenter}`}>
                            <Flex>
                              <ActionIcon size='lg' color='red' onClick={() => onDelete(index)}>
                                <IconTrash size='20px' />
                              </ActionIcon>
                            </Flex>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))
                ) : (
                  <div className={styles.tableRow}>
                    <div className={styles.rowWrapper}>
                      <div className={styles.tableBodyCell}>Nenhuma Linha Selecionada</div>
                    </div>
                  </div>
                )}
                {provided.placeholder}
              </div>
              <StopSequenceFooter />
            </div>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );

  //
}
