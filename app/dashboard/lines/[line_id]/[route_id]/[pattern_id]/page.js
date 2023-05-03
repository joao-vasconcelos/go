'use client';

import useSWR from 'swr';
import { styled } from '@stitches/react';
import { useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, yupResolver } from '@mantine/form';
import API from '../../../../../../services/API';
import { Validation as PatternValidation } from '../../../../../../schemas/Pattern/validation';
import { Default as PatternDefault } from '../../../../../../schemas/Pattern/default';
import { Tooltip, Button, SimpleGrid, TextInput, ActionIcon, Divider, Text, Select } from '@mantine/core';
import { TbExternalLink, TbTrash } from 'react-icons/tb';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import Pannel from '../../../../../../layouts/Pannel';
import SaveButtons from '../../../../../../components/SaveButtons';
import notify from '../../../../../../services/notify';
import { openConfirmModal } from '@mantine/modals';
import Line from '../../../../../../components/line/Line';
import StopSequenceCard from './StopSequenceCard';
import StopSequenceTable from './StopSequenceTable';

const SectionTitle = styled('p', {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '$gray12',
});

const Section = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  padding: '$lg',
  gap: '$md',
  width: '100%',
  maxHeight: '100%',
});

export default function Page() {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [hasErrorSaving, setHasErrorSaving] = useState();

  const [isCreatingStopSequence, setIsCreatingStopSequence] = useState();

  const { line_id, route_id, pattern_id } = useParams();

  //
  // B. Fetch data

  const { data: shapesData, error: shapesError, isLoading: shapesLoading } = useSWR('/api/shapes');
  const { data: lineData, error: lineError, isLoading: lineLoading, isValidating: lineValidating, mutate: lineMutate } = useSWR(line_id && `/api/lines/${line_id}`);
  const { data: routeData, error: routeError, isLoading: routeLoading, isValidating: routeValidating, mutate: routeMutate } = useSWR(route_id && `/api/routes/${route_id}`);
  const { data: patternData, error: patternError, isLoading: patternLoading } = useSWR(pattern_id && `/api/patterns/${pattern_id}`, { onSuccess: (data) => keepFormUpdated(data) });

  //
  // C. Setup form

  const form = useForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    clearInputErrorOnChange: true,
    validate: yupResolver(PatternValidation),
    initialValues: patternData || PatternDefault,
  });

  const keepFormUpdated = (data) => {
    if (!form.isDirty()) {
      form.setValues(data);
      form.resetDirty(data);
    }
  };

  //
  // D. Handle actions

  const handleValidate = () => {
    form.validate();
  };

  const handleClose = async () => {
    router.push(`/dashboard/lines/${line_id}/${route_id}`);
  };

  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);
      await API({ service: 'patterns', resourceId: pattern_id, operation: 'edit', method: 'PUT', body: form.values });
      form.resetDirty();
      setIsSaving(false);
      setHasErrorSaving(false);
    } catch (err) {
      console.log(err);
      setIsSaving(false);
      setHasErrorSaving(err);
    }
  }, [pattern_id, form]);

  const handleDelete = async () => {
    openConfirmModal({
      title: (
        <Text size={'lg'} fw={700}>
          Eliminar Pattern?
        </Text>
      ),
      centered: true,
      closeOnClickOutside: true,
      children: <Text>Eliminar é irreversível. Tem a certeza que quer eliminar este Pattern para sempre?</Text>,
      labels: { confirm: 'Eliminar Pattern', cancel: 'Não Eliminar' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          notify(pattern_id, 'loading', 'A eliminar Pattern...');
          await API({ service: 'patterns', resourceId: pattern_id, operation: 'delete', method: 'DELETE' });
          patternr.push(`/dashboard/lines/${line_id}`);
          notify(pattern_id, 'success', 'Pattern eliminada!');
        } catch (err) {
          console.log(err);
          notify(pattern_id, 'error', err.message || 'Occoreu um erro.');
        }
      },
    });
  };

  const handleCreateStopSequence = async () => {
    // try {
    //   setIsCreatingStopSequence(true);
    //   notify('new-pattern', 'loading', 'A criar Pattern...');
    //   const response = await API({ service: 'patterns', operation: 'create', method: 'POST', body: { parent_route: route_id } });
    form.insertListItem('path', {});
    //   notify('new-pattern', 'success', 'Pattern criado com sucesso.');
    //   setIsCreatingStopSequence(false);
    // } catch (err) {
    //   setIsCreatingStopSequence(false);
    //   console.log(err);
    //   notify('new-pattern', 'error', err.message);
    // }
  };

  const handleStopSequenceReorder = async ({ destination, source }) => {
    openConfirmModal({
      title: (
        <Text size={'lg'} fw={700}>
          Re-ordernar sequência de paragens?
        </Text>
      ),
      centered: true,
      closeOnClickOutside: true,
      children: <Text>Atenção que ao re-ordenar as paragens pode causar erros no cálculo das distâncias, etc. Tem a certeza que pretende re-ordenar a sequência de paragens?</Text>,
      labels: { confirm: 'Sim, re-ordenar paragens', cancel: 'Manter como está' },
      confirmProps: { color: 'blue' },
      onConfirm: async () => {
        // Perform reorder on confirm
        form.reorderListItem('path', { from: source.index, to: destination.index });
      },
    });
  };

  //   const handleOpenStopSequence = (pattern_id) => {
  //     router.push(`/dashboard/lines/${line_id}/${route_id}/${pattern_id}`);
  //   };

  //
  // E. Render components

  return (
    <Pannel
      loading={patternLoading}
      header={
        <>
          <SaveButtons
            isValid={form.isValid()}
            isDirty={form.isDirty()}
            isLoading={patternLoading}
            isErrorValidating={patternError}
            isSaving={isSaving}
            isErrorSaving={hasErrorSaving}
            onValidate={() => handleValidate()}
            onSave={async () => await handleSave()}
            onClose={async () => await handleClose()}
          />
          <Line
            short_name={(lineData && lineData.line_short_name) || '•••'}
            long_name={`${(lineData && lineData.line_long_name) || 'Loading...'} (${form.values.headsign || 'Pattern sem headsign'})`}
            color={(lineData && lineData.line_color) || ''}
            text_color={(lineData && lineData.line_text_color) || ''}
          />
          <Tooltip label='Ver no site' color='blue' position='bottom' withArrow>
            <ActionIcon color='blue' variant='light' size='lg'>
              <TbExternalLink size='20px' />
            </ActionIcon>
          </Tooltip>
          <Tooltip label='Eliminar Pattern' color='red' position='bottom' withArrow>
            <ActionIcon color='red' variant='light' size='lg' onClick={handleDelete}>
              <TbTrash size='20px' />
            </ActionIcon>
          </Tooltip>
        </>
      }
    >
      <form onSubmit={form.onSubmit(async () => await handleSave())}>
        <Section>
          <SectionTitle>Detalhes do Pattern</SectionTitle>
          <SimpleGrid cols={2}>
            <TextInput placeholder='Headsign' label='Headsign' {...form.getInputProps('headsign')} />
            <Select
              label='Shape'
              placeholder='Shape'
              searchable
              nothingFound='Sem opções'
              w={'100%'}
              data={
                shapesData
                  ? shapesData.map((item) => {
                      return { value: item._id, label: item.shape_name || 'Shape sem Nome' };
                    })
                  : []
              }
            />
          </SimpleGrid>
        </Section>
        <Divider />
        <Section>
          <SectionTitle>Paragens</SectionTitle>
          <SimpleGrid cols={1}>
            {/* <DragDropContext onDragEnd={handleStopSequenceReorder}>
              <Droppable droppableId='droppable'>
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}> */}
            <StopSequenceTable form={form} onReorder={handleStopSequenceReorder} />
            {/* </div>
                )}
              </Droppable>
            </DragDropContext> */}
            <Button onClick={handleCreateStopSequence} loading={isCreatingStopSequence}>
              Add Stop to Sequence
            </Button>
          </SimpleGrid>
        </Section>
        <Divider />
      </form>
    </Pannel>
  );
}
