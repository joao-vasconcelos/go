'use client';

import { styled } from '@stitches/react';
import { Select, ActionIcon, Flex, Checkbox, TimeInput, Tooltip, NumberInput, MultiSelect } from '@mantine/core';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { TbSortAscendingNumbers, TbChevronUp, TbX, TbArrowBarUp, TbClockPause, TbEqual, TbPlayerTrackNext, TbArrowBarToDown, TbArrowAutofitContent, TbTrash, TbChevronDown, TbClockHour4, TbChevronRight, TbGripVertical } from 'react-icons/tb';

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
  gridTemplateColumns: '40px 40px 300px 40px 40px 180px 40px 180px 40px 180px 120px 500px 70px',
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

export default function StopSequenceTable({ form, onReorder, index = 1 }) {
  //

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
                {form.values.path.map((item, index) => (
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
                          <Select aria-label='Paragem' placeholder='Paragem' searchable nothingFound='Sem opções' w={'100%'} data={['ijdiijdiijdiijdiijdiijdiijdiijdiijdiijdiijdiijdiijdiijdiijdiijdiijdi', 'asijdai', 'aisjnd']} />
                        </TableCellBody>
                        <TableCellBody hcenter>
                          <Tooltip label='Permite embarque nesta paragem' position='bottom' withArrow>
                            <Checkbox size='sm' defaultChecked />
                          </Tooltip>
                        </TableCellBody>
                        <TableCellBody hcenter>
                          <Tooltip label='Permite desembarque nesta paragem' position='bottom' withArrow>
                            <Checkbox size='sm' defaultChecked />
                          </Tooltip>
                        </TableCellBody>
                        <TableCellBody>
                          {index > 0 ? (
                            <Tooltip label='Distância percorrida desde a paragem anterior até à atual, em metros. (x metros são y km)' position='bottom' width='300px' multiline withArrow>
                              <NumberInput
                                aria-label='distance_delta'
                                placeholder='distance_delta'
                                defaultValue={0}
                                min={0}
                                step={10}
                                stepHoldDelay={500}
                                stepHoldInterval={100}
                                disabled={index === 0}
                                formatter={(value) => `${value} metros`}
                                icon={<TbArrowAutofitContent size='20px' />}
                                value={0}
                              />
                            </Tooltip>
                          ) : (
                            <NumberInput aria-label='distance_delta_at_first_stop' placeholder='distance_delta' formatter={(value) => `${value} metros`} icon={<TbArrowAutofitContent size='20px' />} disabled value={0} />
                          )}
                        </TableCellBody>
                        <TableCellBody>
                          <TbX size='30px' />
                        </TableCellBody>
                        <TableCellBody>
                          {index > 0 ? (
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
                              />
                            </Tooltip>
                          ) : (
                            <NumberInput aria-label='default_travel_time_at_first_stop' placeholder='default_travel_time_at_first_stop' formatter={(value) => `${value} km/h`} icon={<TbPlayerTrackNext size='18px' />} disabled value={0} />
                          )}
                        </TableCellBody>
                        <TableCellBody>
                          <TbEqual size='30px' />
                        </TableCellBody>
                        <TableCellBody>
                          <Tooltip label='Tempo estimado de viagem no troço.' position='bottom' withArrow>
                            <NumberInput aria-label='default_travel_time' placeholder='default_travel_time' formatter={(value) => `${value} hh:mm:ss`} icon={<TbClockHour4 size='18px' />} readOnly value={54} disabled={index === 0} />
                          </Tooltip>
                        </TableCellBody>
                        <TableCellBody>
                          <Tooltip label='Tempo estimado para entrada e saída de passagairos, em segundos. (${segundos} são ${segundos/60} minutos)' /*(s-(s%=60))/60+(9<s?':':':0')+s*/ position='bottom' width='300px' multiline withArrow>
                            <NumberInput aria-label='Default wait time' placeholder='Default wait time' defaultValue={30} min={0} max={900} step={10} stepHoldDelay={500} stepHoldInterval={100} icon={<TbClockPause size='20px' />} />
                          </Tooltip>
                        </TableCellBody>
                        <TableCellBody>
                          <MultiSelect aria-label='Passes aceites' placeholder='Passes aceites' searchable nothingFound='Sem opções' data={['navegante Metropolitano', 'Alcochete', 'Almada', 'etc']} w='100%' />
                        </TableCellBody>
                        <TableCellBody hcenter>
                          <Flex>
                            <ActionIcon size='lg' color='red' onClick={() => handleDeleteSingleRow(row)}>
                              <TbTrash size='20px' />
                            </ActionIcon>
                          </Flex>
                        </TableCellBody>
                      </TableBodyRow>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </TableBody>
            </TableContainer>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );

  return (
    <Draggable draggableId={index.toString()} index={index}>
      {(provided) => (
        <TableBodyRow ref={provided.innerRef} {...provided.draggableProps}>
          <TableCellBody {...provided.dragHandleProps}>
            <TbGripVertical size='20px' />
          </TableCellBody>
          <TableCellBody onClick={() => handleCheckSingleRow(row.row_id)} style={{ cursor: 'pointer' }}>
            {index}
          </TableCellBody>
          <TableCellBody>{index || 0} km</TableCellBody>
          <TableCellBody>{index}</TableCellBody>
          <TableCellBody>
            {/* <Flex>
              <ActionIcon size='lg' color='blue' onClick={() => handleUploadSingleRow(row)}>
                <TbCloudUpload size='20px' />
              </ActionIcon>
              <ActionIcon size='lg' color='red' onClick={() => handleDeleteSingleRow(row)}>
                <TbTrash size='20px' />
              </ActionIcon>
            </Flex> */}
          </TableCellBody>
        </TableBodyRow>
      )}
    </Draggable>
  );

  return (
    <Draggable draggableId={index.toString()} index={index}>
      {(provided) => (
        <Container ref={provided.innerRef} {...provided.draggableProps}>
          <Toolbar {...provided.dragHandleProps}>
            <TbChevronUp size='20px' />
            <TbChevronDown size='20px' />
          </Toolbar>
          <Wrapper>
            {/* <Subtitle isUntitled={!stop_code}>{stop_code ? stop_code : '000000'}</Subtitle> */}
            {/* <Title isUntitled={!stop_name}>{stop_name ? stop_name : 'Paragem Sem Nome'}</Title> */}
          </Wrapper>
          <Toolbar>
            <TbChevronRight size='20px' />
          </Toolbar>
        </Container>
      )}
    </Draggable>
  );
}
