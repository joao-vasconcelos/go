'use client';

import useSWR from 'swr';
import { styled } from '@stitches/react';
import { useRef, useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, yupResolver } from '@mantine/form';
import API from '../../../../../../services/API';
import { Validation as LineValidation } from '../../../../../../schemas/Line/validation';
import { Default as LineDefault } from '../../../../../../schemas/Line/default';
import { Tooltip, Select, MultiSelect, Button, ColorInput, SimpleGrid, TextInput, ActionIcon, Divider, Text } from '@mantine/core';
import { TbSquaresFilled, TbChevronLeft, TbExternalLink, TbTrash } from 'react-icons/tb';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Pannel from '../../../../../../layouts/Pannel';
import SaveButtons from '../../../../../../components/SaveButtons';
import notify from '../../../../../../services/notify';
import { openConfirmModal } from '@mantine/modals';
import Line from '../../../../../../components/line/Line';
import PatternCard from './PatternCard';

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
  const hasUpdatedFields = useRef(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasErrorSaving, setHasErrorSaving] = useState();

  const { line_id, route_id } = useParams();

  //
  // B. Fetch data

  const { data: lineData, error: lineError, isLoading: lineLoading, isValidating: lineValidating, mutate: lineMutate } = useSWR(line_id && `/api/lines/${line_id}`);
  //   const { data: routeData, error: routeError, isLoading: routeLoading, isValidating: routeValidating, mutate: routeMutate } = useSWR(route_id && `/api/routes/${route_id}`);

  //
  // C. Setup form

  const form = useForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    clearInputErrorOnChange: true,
    validate: yupResolver(LineValidation),
    initialValues: LineDefault,
  });

  useEffect(() => {
    if (!hasUpdatedFields.current && lineData) {
      form.setValues(lineData);
      hasUpdatedFields.current = true;
    }
  }, [lineData, form]);

  //
  // D. Handle actions

  const handleValidate = () => {
    form.validate();
  };

  const handleClose = async () => {
    router.push(`/dashboard/lines/${line_id}`);
  };

  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);
      await API({ service: 'lines', resourceId: line_id, operation: 'edit', method: 'PUT', body: form.values });
      lineMutate({ ...lineData, ...form.values });
      setIsSaving(false);
      setHasErrorSaving(false);
      form.resetDirty();
      hasUpdatedFields.current = false;
    } catch (err) {
      console.log(err);
      setIsSaving(false);
      setHasErrorSaving(err);
    }
  }, [line_id, form, lineMutate, lineData]);

  const handleDelete = async () => {
    openConfirmModal({
      title: (
        <Text size={'lg'} fw={700}>
          Eliminar Linha?
        </Text>
      ),
      centered: true,
      closeOnClickOutside: true,
      children: <Text>Eliminar é irreversível. Tem a certeza que quer eliminar esta Linha para sempre?</Text>,
      labels: { confirm: 'Eliminar Linha', cancel: 'Não Eliminar' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          notify(line_id, 'loading', 'A eliminar Linha...');
          await API({ service: 'lines', resourceId: line_id, operation: 'delete', method: 'DELETE' });
          router.push('/dashboard/lines');
          notify(line_id, 'success', 'Linha eliminada!');
        } catch (err) {
          console.log(err);
          notify(line_id, 'error', err.message || 'Occoreu um erro.');
        }
      },
    });
  };

  const handleAddRoute = () => {
    form.insertListItem('routes', LineDefault.routes[0]);
    form.values.routes.forEach((item, index) => {
      const line_code = form.values.line_code;
      form.setFieldValue(`routes.${index}.route_code`, `${line_code}_${index}`);
    });
  };

  const handleRoutesReorder = ({ destination, source }) => {
    form.reorderListItem('routes', { from: source.index, to: destination.index });
    form.values.routes.forEach((item, index) => {
      const line_code = form.values.line_code;
      form.setFieldValue(`routes.${index}.route_code`, `${line_code}_${index}`);
    });
  };

  const handleOpenRoute = (index) => {
    const route_id = form.values.routes[index]._id;
    router.push(`/dashboard/lines/${line_id}/${route_id}`);
  };

  //
  // E. Render components

  return (
    <Pannel
      header={
        <>
          <SaveButtons
            isValid={form.isValid()}
            isDirty={form.isDirty()}
            isLoading={lineLoading}
            isValidating={lineValidating}
            isErrorValidating={lineError}
            isSaving={isSaving}
            isErrorSaving={hasErrorSaving}
            onValidate={() => handleValidate()}
            onSave={async () => await handleSave()}
            onClose={async () => await handleClose()}
          />
          <Line short_name={form.values.line_short_name} long_name={`${form.values.line_long_name} (${form.values.line_long_name})`} color={form.values.line_color} text_color={form.values.line_text_color} />
          <Tooltip label='Ver no site' color='blue' position='bottom' withArrow>
            <ActionIcon color='blue' variant='light' size='lg'>
              <TbExternalLink size='20px' />
            </ActionIcon>
          </Tooltip>
          <Tooltip label='Eliminar Linha' color='red' position='bottom' withArrow>
            <ActionIcon color='red' variant='light' size='lg' onClick={handleDelete}>
              <TbTrash size='20px' />
            </ActionIcon>
          </Tooltip>
        </>
      }
    >
      <form onSubmit={form.onSubmit(async () => await handleSave())}>
        <Section>
          <SectionTitle>Detalhes da Rota</SectionTitle>
          <SimpleGrid cols={1}>
            <TextInput placeholder='Nome da Rota' label='Nome da Rota' {...form.getInputProps('line_long_name')} />
          </SimpleGrid>
        </Section>
        <Divider />
        <Section>
          <SectionTitle>Patterns</SectionTitle>
          <SimpleGrid cols={1}>
            <PatternCard direction={0} />
            <PatternCard direction={1} />
          </SimpleGrid>
        </Section>
        <Divider />
      </form>
    </Pannel>
  );
}
