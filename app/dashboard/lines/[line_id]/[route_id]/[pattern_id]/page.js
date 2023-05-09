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
import Pannel from '../../../../../../components/Pannel/Pannel';
import SaveButtons from '../../../../../../components/SaveButtons';
import notify from '../../../../../../services/notify';
import { openConfirmModal } from '@mantine/modals';
import Line from '../../../../../../components/line/Line';
import StopSequenceTable from './StopSequenceTable';
import SchedulesTable from './SchedulesTable';
import calculateDistanceBetweenStops from '../../../../../../services/calculateDistanceBetweenStops';

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
  const [isCreatingSchedule, setIsCreatingSchedule] = useState();

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
    form.insertListItem('path', PatternDefault.path[0]);
  };

  const handleStopSequenceReorder = async ({ source, destination }) => {
    if (source.index === destination.index) return;
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
        // Reset values of first stop to zero
        // form.setValues('path.0.distance_delta', 0);
        // form.setValues('path.0.default_velocity', 0);
      },
    });
  };

  const handleDeleteSequenceRow = async (index) => {
    openConfirmModal({
      title: (
        <Text size={'lg'} fw={700}>
          Eliminar paragem da sequência?
        </Text>
      ),
      centered: true,
      closeOnClickOutside: true,
      children: <Text>Atenção que ao re-ordenar as paragens pode causar erros no cálculo das distâncias, etc. Tem a certeza que pretende re-ordenar a sequência de paragens?</Text>,
      labels: { confirm: 'Sim, eliminar paragem', cancel: 'Manter como está' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        // Perform delete on confirm
        form.removeListItem('path', index);
      },
    });
  };

  const handleCalculateStopDistances = async () => {
    //

    // console.log(patternData.path);
    // return;

    const patternShape = await API({ service: 'shapes', resourceId: form.values.shape, method: 'GET' });
    const patternShapeCoordinates = patternShape.geojson.geometry.coordinates;

    for (let index = 0; index < form.values.path.length; index++) {
      //
      // Skip the first iteration
      if (index === 0) {
        // The first stop is zero
        form.setFieldValue(`path.${index}.distance_delta`, 0);
        continue;
        //
      }

      // Get the two stops
      const stopSequencePrev = form.values.path[index - 1];
      const stopSequenceCurrent = form.values.path[index];

      const stopPrev = await API({ service: 'stops', resourceId: stopSequencePrev.stop_id, method: 'GET' });
      const stopCurrent = await API({ service: 'stops', resourceId: stopSequenceCurrent.stop_id, method: 'GET' });

      const stopPrevCoordinates = [stopPrev.stop_lat, stopPrev.stop_lon];
      const stopCurrentCoordinates = [stopCurrent.stop_lat, stopCurrent.stop_lon];

      console.log('stopPrevCoordinates', stopPrevCoordinates);
      console.log('stopCurrentCoordinates', stopCurrentCoordinates);

      const distance = calculateDistanceBetweenStops(stopPrevCoordinates, stopCurrentCoordinates, patternShapeCoordinates);

      form.setFieldValue(`path.${index}.distance_delta`, distance);

      console.log('distance', distance);
    }

    // getStopsDistance();
    console.log('calculate stop distances');
  };

  //   const handleOpenStopSequence = (pattern_id) => {
  //     router.push(`/dashboard/lines/${line_id}/${route_id}/${pattern_id}`);
  //   };

  const handleCreateSchedule = async () => {
    form.insertListItem('schedules', PatternDefault.schedules[0]);
  };

  const handleDeleteScheduleRow = async (index) => {
    openConfirmModal({
      title: (
        <Text size={'lg'} fw={700}>
          Eliminar horário?
        </Text>
      ),
      centered: true,
      closeOnClickOutside: true,
      children: <Text>Tem a certeza que pretende eliminar este horário?</Text>,
      labels: { confirm: 'Sim, eliminar horário', cancel: 'Manter como está' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        // Perform delete on confirm
        form.removeListItem('schedules', index);
      },
    });
  };

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
              {...form.getInputProps('shape')}
              data={
                shapesData
                  ? shapesData.map((item) => {
                      return { value: item._id, label: `[${item.shape_code}] ${item.shape_name || 'Shape sem Nome'}` };
                    })
                  : []
              }
            />
          </SimpleGrid>
        </Section>
        <Divider />
        <Section>
          <SectionTitle>Paragens</SectionTitle>
          <Button onClick={handleCalculateStopDistances} disabled={isCreatingStopSequence} variant='light'>
            Calcular distâncias entre paragens
          </Button>
          <SimpleGrid cols={1}>
            <StopSequenceTable form={form} onReorder={handleStopSequenceReorder} onDelete={handleDeleteSequenceRow} />
            <Button onClick={handleCreateStopSequence} loading={isCreatingStopSequence}>
              Add Stop to Sequence
            </Button>
          </SimpleGrid>
        </Section>
        <Divider />
        <Section>
          <SectionTitle>Horários</SectionTitle>
          <SimpleGrid cols={1}>
            <SchedulesTable form={form} onDelete={handleDeleteScheduleRow} />
            <Button onClick={handleCreateSchedule} loading={isCreatingSchedule}>
              Adicionar novo Horário
            </Button>
          </SimpleGrid>
        </Section>
      </form>
    </Pannel>
  );
}
