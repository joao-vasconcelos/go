'use client';

import useSWR from 'swr';
import { useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, yupResolver } from '@mantine/form';
import API from '../../../../../../services/API';
import { Validation as RouteValidation } from '../../../../../../schemas/Route/validation';
import { Default as RouteDefault } from '../../../../../../schemas/Route/default';
import { Tooltip, Button, SimpleGrid, TextInput, ActionIcon, Divider } from '@mantine/core';
import { IconExternalLink, IconTrash } from '@tabler/icons-react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import Pannel from '../../../../../../components/Pannel/Pannel';
import Text from '../../../../../../components/Text/Text';
import { Section } from '../../../../../../components/Layouts/Layouts';
import SaveButtons from '../../../../../../components/SaveButtons';
import notify from '../../../../../../services/notify';
import { openConfirmModal } from '@mantine/modals';
import LineDisplay from '../../../../../../components/LineDisplay/LineDisplay';
import PatternCard from '../../../../../../components/PatternCard/PatternCard';
import { useTranslations } from 'next-intl';

export default function Page() {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const t = useTranslations('routes');
  const [isSaving, setIsSaving] = useState(false);
  const [hasErrorSaving, setHasErrorSaving] = useState();

  const [isCreatingPattern, setIsCreatingPattern] = useState(false);

  const { line_id, route_id } = useParams();

  //
  // B. Fetch data

  const { data: lineData, error: lineError, isLoading: lineLoading, isValidating: lineValidating, mutate: lineMutate } = useSWR(line_id && `/api/lines/${line_id}`);
  const { data: routeData, error: routeError, isLoading: routeLoading } = useSWR(route_id && `/api/routes/${route_id}`, { onSuccess: (data) => keepFormUpdated(data) });

  //
  // C. Setup form

  const form = useForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    clearInputErrorOnChange: true,
    validate: yupResolver(RouteValidation),
    initialValues: routeData || RouteDefault,
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
    router.push(`/dashboard/lines/${line_id}`);
  };

  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);
      await API({ service: 'routes', resourceId: route_id, operation: 'edit', method: 'PUT', body: form.values });
      form.resetDirty();
      setIsSaving(false);
      setHasErrorSaving(false);
    } catch (err) {
      console.log(err);
      setIsSaving(false);
      setHasErrorSaving(err);
    }
  }, [route_id, form]);

  const handleDelete = async () => {
    openConfirmModal({
      title: <Text size='h2'>{t('operations.delete.title')}</Text>,
      centered: true,
      closeOnClickOutside: true,
      children: <Text size='h3'>{t('operations.delete.description')}</Text>,
      labels: { confirm: t('operations.delete.confirm'), cancel: t('operations.delete.cancel') },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          notify(route_id, 'loading', t('operations.delete.loading'));
          await API({ service: 'routes', resourceId: route_id, operation: 'delete', method: 'DELETE' });
          router.push('/dashboard/routes');
          notify(route_id, 'success', t('operations.delete.success'));
        } catch (err) {
          console.log(err);
          notify(route_id, 'error', err.message || t('operations.delete.error'));
        }
      },
    });
  };

  const handleCreatePattern = async () => {
    try {
      setIsCreatingPattern(true);
      notify('new-pattern', 'loading', 'A criar Pattern...');
      const response = await API({ service: 'patterns', operation: 'create', method: 'POST', body: { parent_route: route_id } });
      form.insertListItem('patterns', response);
      notify('new-pattern', 'success', 'Pattern criado com sucesso.');
      setIsCreatingPattern(false);
    } catch (err) {
      setIsCreatingPattern(false);
      console.log(err);
      notify('new-pattern', 'error', err.message);
    }
  };

  const handlePatternsReorder = async ({ destination, source }) => {
    form.reorderListItem('patterns', { from: source.index, to: destination.index });
  };

  const handleOpenPattern = (pattern_id) => {
    router.push(`/dashboard/lines/${line_id}/${route_id}/${pattern_id}`);
  };

  //
  // E. Render components

  return (
    <Pannel
      loading={routeLoading}
      header={
        <>
          <SaveButtons
            isValid={form.isValid()}
            isDirty={form.isDirty()}
            isLoading={routeLoading}
            isErrorValidating={routeError}
            isSaving={isSaving}
            isErrorSaving={hasErrorSaving}
            onValidate={() => handleValidate()}
            onSave={async () => await handleSave()}
            onClose={async () => await handleClose()}
          />
          <LineDisplay
            short_name={(lineData && lineData.line_short_name) || '•••'}
            long_name={`${(lineData && lineData.line_long_name) || 'Loading...'} (${form.values.route_name || 'Rota sem nome'})`}
            color={(lineData && lineData.line_color) || ''}
            text_color={(lineData && lineData.line_text_color) || ''}
          />
          <Tooltip label='Ver no site' color='blue' position='bottom' withArrow>
            <ActionIcon color='blue' variant='light' size='lg'>
              <IconExternalLink size='20px' />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={t('operations.delete.title')} color='red' position='bottom' withArrow>
            <ActionIcon color='red' variant='light' size='lg' onClick={handleDelete}>
              <IconTrash size='20px' />
            </ActionIcon>
          </Tooltip>
        </>
      }
    >
      <form onSubmit={form.onSubmit(async () => await handleSave())}>
        <Section>
          <Text size='h2'>{t('sections.config.title')}</Text>
          <SimpleGrid cols={1}>
            <TextInput label={t('form.route_name.label')} placeholder={t('form.route_name.placeholder')} {...form.getInputProps('route_name')} />
          </SimpleGrid>
        </Section>
        <Divider />
        <Section>
          <Text size='h2'>{t('sections.patterns.title')}</Text>
          <DragDropContext onDragEnd={handlePatternsReorder}>
            <Droppable droppableId='droppable'>
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {form.values.patterns.map((item, index) => (
                    <PatternCard key={index} index={index} onOpen={handleOpenPattern} pattern_id={item._id} headsign={item.headsign} />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <Button onClick={handleCreatePattern} loading={isCreatingPattern} disabled={form.values.patterns.length > 1}>
            Add Pattern
          </Button>
        </Section>
      </form>
    </Pannel>
  );
}
