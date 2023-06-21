'use client';

import useSWR from 'swr';
import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import styles from './StopSequenceTable.module.css';
import { Select, ActionIcon, Flex, Checkbox, Tooltip, NumberInput, MultiSelect } from '@mantine/core';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { IconSortAscendingNumbers, IconX, IconArrowBarUp, IconClockPause, IconEqual, IconPlayerTrackNext, IconArrowBarToDown, IconArrowAutofitContent, IconTrash, IconClockHour4, IconGripVertical } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import AuthGate, { isAllowed } from '@/components/AuthGate/AuthGate';

export default function StopSequenceTable({ form, onReorder, onDelete }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('StopSequenceTable');
  const { data: session } = useSession();
  const isReadOnly = !isAllowed(session, 'lines', 'create_edit');

  //
  // B. Fetch data

  const { data: allStopsData } = useSWR('/api/stops');
  const { data: allZonesData } = useSWR('/api/zones');

  //
  // D. Format data

  const allStopsDataFormatted = useMemo(() => {
    return allStopsData
      ? allStopsData.map((item) => {
          return { value: item._id, label: `[${item.code}] ${item.name || '-'}` };
        })
      : [];
  }, [allStopsData]);

  const allZonesDataFormatted = useMemo(() => {
    return allZonesData
      ? allZonesData.map((item) => {
          return { value: item._id, label: item.name || '-' };
        })
      : [];
  }, [allZonesData]);

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
      <div className={styles.tableHeaderCell}>{t('form.stop.label')}</div>
      <div className={`${styles.tableHeaderCell} ${styles.hcenter}`}>
        <Tooltip label={t('form.allow_pickup.label')} withArrow>
          <IconArrowBarToDown size='20px' />
        </Tooltip>
      </div>
      <div className={`${styles.tableHeaderCell} ${styles.hcenter}`}>
        <Tooltip label={t('form.allow_drop_off.label')} withArrow>
          <IconArrowBarUp size='20px' />
        </Tooltip>
      </div>
      <div className={styles.tableHeaderCell}>{t('form.distance_delta.label')}</div>
      <div className={styles.tableHeaderCell} />
      <div className={styles.tableHeaderCell}>{t('form.default_velocity.label')}</div>
      <div className={styles.tableHeaderCell} />
      <div className={styles.tableHeaderCell}>{t('form.default_travel_time.label')}</div>
      <div className={styles.tableHeaderCell}>{t('form.default_dwell_time.label')}</div>
      <div className={styles.tableHeaderCell}>{t('form.zones.label')}</div>
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
                              aria-label={t('form.stop.label')}
                              placeholder={t('form.stop.placeholder')}
                              nothingFound={t('form.stop.nothingFound')}
                              {...form.getInputProps(`path.${index}.stop`)}
                              data={allStopsDataFormatted}
                              readOnly={isReadOnly}
                              searchable
                              w='100%'
                            />
                          </div>
                          <div className={`${styles.tableBodyCell} ${styles.hcenter}`}>
                            <Tooltip label={t('form.allow_pickup.description')} position='bottom' withArrow>
                              <Checkbox size='sm' {...form.getInputProps(`path.${index}.allow_pickup`, { type: 'checkbox' })} readOnly={isReadOnly} />
                            </Tooltip>
                          </div>
                          <div className={`${styles.tableBodyCell} ${styles.hcenter}`}>
                            <Tooltip label={t('form.allow_drop_off.description')} position='bottom' withArrow>
                              <Checkbox size='sm' {...form.getInputProps(`path.${index}.allow_drop_off`, { type: 'checkbox' })} readOnly={isReadOnly} />
                            </Tooltip>
                          </div>
                          <div className={styles.tableBodyCell}>
                            <Tooltip label={t('form.distance_delta.description')} position='bottom' withArrow>
                              <NumberInput
                                aria-label={t('form.distance_delta.label')}
                                placeholder={t('form.distance_delta.placeholder')}
                                defaultValue={0}
                                min={0}
                                step={10}
                                stepHoldDelay={500}
                                stepHoldInterval={100}
                                formatter={formatMetersToDistance}
                                icon={<IconArrowAutofitContent size='20px' />}
                                {...form.getInputProps(`path.${index}.distance_delta`)}
                                disabled={index === 0}
                                readOnly={isReadOnly}
                                value={index === 0 ? 0 : form.values.path[index].distance_delta}
                              />
                            </Tooltip>
                          </div>
                          <div className={styles.tableBodyCell}>
                            <IconX size='20px' />
                          </div>
                          <div className={styles.tableBodyCell}>
                            <Tooltip label={t('form.default_velocity.description')} position='bottom' withArrow>
                              <NumberInput
                                aria-label={t('form.default_velocity.label')}
                                placeholder={t('form.default_velocity.placeholder')}
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
                            <Tooltip label={t('form.default_travel_time.description')} position='bottom' width={350} multiline withArrow>
                              <NumberInput
                                aria-label={t('form.default_travel_time.label')}
                                placeholder={t('form.default_travel_time.placeholder')}
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
                            <Tooltip label={t('form.default_dwell_time.description')} position='bottom' width={350} multiline withArrow>
                              <NumberInput
                                aria-label={t('form.default_dwell_time.label')}
                                placeholder={t('form.default_dwell_time.placeholder')}
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
                              aria-label={t('form.zones.label')}
                              placeholder={t('form.zones.placeholder')}
                              nothingFound={t('form.zones.nothingFound')}
                              {...form.getInputProps(`path.${index}.zones`)}
                              data={allZonesDataFormatted}
                              readOnly={isReadOnly}
                              searchable
                              w='100%'
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
