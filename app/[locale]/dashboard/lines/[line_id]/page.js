'use client';

import useSWR from 'swr';
import { styled } from '@stitches/react';
import { useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, yupResolver } from '@mantine/form';
import API from '../../../../../services/API';
import { Validation as LineValidation } from '../../../../../schemas/Line/validation';
import { Default as LineDefault } from '../../../../../schemas/Line/default';
import { Tooltip, Select, MultiSelect, Button, ColorInput, SimpleGrid, TextInput, ActionIcon, Divider, Text } from '@mantine/core';
import { IconExternalLink, IconTrash } from '@tabler/icons-react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import Pannel from '../../../../../components/Pannel/Pannel';
import SaveButtons from '../../../../../components/SaveButtons';
import notify from '../../../../../services/notify';
import { openConfirmModal } from '@mantine/modals';
import Line from '../../../../../components/line/Line';
import RouteCard from './RouteCard';

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

  const [isCreatingRoute, setIsCreatingRoute] = useState(false);

  const { line_id } = useParams();

  //
  // B. Fetch data

  const { data: lineData, error: lineError, isLoading: lineLoading } = useSWR(line_id && `/api/lines/${line_id}`, { onSuccess: (data) => keepFormUpdated(data) });

  //
  // C. Setup form

  const form = useForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    clearInputErrorOnChange: true,
    validate: yupResolver(LineValidation),
    initialValues: lineData || LineDefault,
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
    router.push(`/dashboard/lines/`);
  };

  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);
      await API({ service: 'lines', resourceId: line_id, operation: 'edit', method: 'PUT', body: form.values });
      form.resetDirty();
      setIsSaving(false);
      setHasErrorSaving(false);
    } catch (err) {
      console.log(err);
      setIsSaving(false);
      setHasErrorSaving(err);
    }
  }, [line_id, form]);

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

  const handleAddRoute = async () => {
    try {
      setIsCreatingRoute(true);
      notify('new-route', 'loading', 'A criar Rota...');
      const response = await API({ service: 'routes', operation: 'create', method: 'POST', body: { parent_line: line_id } });
      form.insertListItem('routes', response);
      notify('new-route', 'success', 'Rota criada com sucesso.');
      setIsCreatingRoute(false);
    } catch (err) {
      setIsCreatingRoute(false);
      console.log(err);
      notify('new-route', 'error', err.message);
    }
  };

  const handleRoutesReorder = async ({ destination, source }) => {
    form.reorderListItem('routes', { from: source.index, to: destination.index });
  };

  const handleOpenRoute = (route_id) => {
    router.push(`/dashboard/lines/${line_id}/${route_id}`);
  };

  //
  // E. Render components

  return (
    <Pannel
      loading={lineLoading}
      header={
        <>
          <SaveButtons
            isValid={form.isValid()}
            isDirty={form.isDirty()}
            isLoading={lineLoading}
            isErrorValidating={lineError}
            isSaving={isSaving}
            isErrorSaving={hasErrorSaving}
            onValidate={() => handleValidate()}
            onSave={async () => await handleSave()}
            onClose={async () => await handleClose()}
          />
          <Line short_name={form.values.line_short_name} long_name={form.values.line_long_name} color={form.values.line_color} text_color={form.values.line_text_color} />
          <Tooltip label='Ver no site' color='blue' position='bottom' withArrow>
            <ActionIcon color='blue' variant='light' size='lg'>
              <IconExternalLink size='20px' />
            </ActionIcon>
          </Tooltip>
          <Tooltip label='Eliminar Linha' color='red' position='bottom' withArrow>
            <ActionIcon color='red' variant='light' size='lg' onClick={handleDelete}>
              <IconTrash size='20px' />
            </ActionIcon>
          </Tooltip>
        </>
      }
    >
      <form onSubmit={form.onSubmit(async () => await handleSave())}>
        <Section>
          <SectionTitle>Detalhes da Linha</SectionTitle>
          <SimpleGrid cols={2}>
            <SimpleGrid cols={2}>
              <TextInput placeholder='Código da Linha' label='Código da Linha' {...form.getInputProps('line_code')} />
              <TextInput placeholder='Número da Linha' label='Número da Linha' {...form.getInputProps('line_short_name')} />
            </SimpleGrid>
            <TextInput placeholder='Nome da Linha' label='Nome da Linha' {...form.getInputProps('line_long_name')} />
          </SimpleGrid>
          <SimpleGrid cols={2}>
            <ColorInput placeholder='Cor da Linha' label='Cor da Linha' {...form.getInputProps('line_color')} />
            <ColorInput placeholder='Cor do Texto' label='Cor do Texto' {...form.getInputProps('line_text_color')} />
          </SimpleGrid>
          <SimpleGrid cols={2}>
            <MultiSelect label='Agência(s)' placeholder='Operadores(s) afetos' searchable nothingFound='Sem opções' w={'100%'} data={['41 - Viação Alvorada', '42 - Rodoviária de Lisboa', '43 - TST', '44 - Alsa Todi']} />
            <Select label='Tarifário' placeholder='Tipo de Linha' searchable nothingFound='Sem opções' w={'100%'} data={['Rápida', 'Longa', 'Próxima', 'Mar', 'Inter-regional']} />
          </SimpleGrid>
        </Section>
        <Divider />
        <Section>
          <SectionTitle>Rotas</SectionTitle>
          <DragDropContext onDragEnd={handleRoutesReorder}>
            <Droppable droppableId='droppable'>
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {form.values.routes.map((item, index) => (
                    <RouteCard key={index} index={index} onOpen={handleOpenRoute} line_code={form.values.line_short_name} route_id={item._id} route_name={item.route_name} />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <Button onClick={handleAddRoute} loading={isCreatingRoute}>
            Add Route
          </Button>
        </Section>
      </form>
    </Pannel>
  );
}
