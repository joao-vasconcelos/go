'use client';

import useSWR from 'swr';
import { useState, useCallback, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, yupResolver } from '@mantine/form';
import API from '../../../../../services/API';
import { Validation as LineValidation } from '../../../../../schemas/Line/validation';
import { Default as LineDefault } from '../../../../../schemas/Line/default';
import { Tooltip, Select, MultiSelect, Button, ColorInput, SimpleGrid, TextInput, ActionIcon, Divider } from '@mantine/core';
import { IconExternalLink, IconTrash } from '@tabler/icons-react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import Pannel from '../../../../../components/Pannel/Pannel';
import Text from '../../../../../components/Text/Text';
import { Section } from '../../../../../components/Layouts/Layouts';
import AutoSave from '../../../../../components/AutoSave/AutoSave';
import notify from '../../../../../services/notify';
import { openConfirmModal } from '@mantine/modals';
import LineDisplay from '../../../../../components/LineDisplay/LineDisplay';
import RouteCard from '../../../../../components/RouteCard/RouteCard';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import AuthGate, { isAllowed } from '../../../../../components/AuthGate/AuthGate';

export default function Page() {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const t = useTranslations('lines');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasErrorSaving, setHasErrorSaving] = useState();
  const [isCreatingRoute, setIsCreatingRoute] = useState(false);
  const { data: session } = useSession();
  const isReadOnly = !isAllowed(session, 'lines', 'create_edit');

  const { line_id } = useParams();

  //
  // B. Fetch data

  const { mutate: allLinesMutate } = useSWR('/api/lines');
  const { data: lineData, error: lineError, isLoading: lineLoading, mutate: lineMutate } = useSWR(line_id && `/api/lines/${line_id}`, { onSuccess: (data) => keepFormUpdated(data) });
  const { data: allAgenciesData } = useSWR('/api/agencies');
  const { data: allFaresData } = useSWR('/api/fares');

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
  // D. Format data

  const allAgenciesDataFormatted = useMemo(() => {
    return allAgenciesData
      ? allAgenciesData.map((item) => {
          return { value: item._id, label: item.name || '-' };
        })
      : [];
  }, [allAgenciesData]);

  const allFaresDataFormatted = useMemo(() => {
    return allFaresData
      ? allFaresData.map((item) => {
          return { value: item._id, label: item.long_name || '-' };
        })
      : [];
  }, [allFaresData]);

  //
  // D. Handle actions

  const handleValidate = () => {
    form.validate();
  };

  const handleClose = async () => {
    router.push(`/dashboard/lines`);
  };

  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);
      await API({ service: 'lines', resourceId: line_id, operation: 'edit', method: 'PUT', body: form.values });
      lineMutate();
      allLinesMutate();
      form.resetDirty();
      setIsSaving(false);
      setHasErrorSaving(false);
    } catch (err) {
      console.log(err);
      setIsSaving(false);
      setHasErrorSaving(err);
    }
  }, [line_id, form, lineMutate, allLinesMutate]);

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
          setIsDeleting(true);
          notify(line_id, 'loading', t('operations.delete.loading'));
          await API({ service: 'lines', resourceId: line_id, operation: 'delete', method: 'DELETE' });
          allLinesMutate();
          router.push('/dashboard/lines');
          notify(line_id, 'success', t('operations.delete.success'));
          setIsDeleting(false);
        } catch (err) {
          console.log(err);
          setIsDeleting(false);
          notify(line_id, 'error', err.message || t('operations.delete.error'));
        }
      },
    });
  };

  const handleAddRoute = async () => {
    try {
      setIsCreatingRoute(true);
      notify('new-route', 'loading', t('form.routes.create.loading'));
      const response = await API({ service: 'routes', operation: 'create', method: 'POST', body: { parent_line: line_id } });
      form.insertListItem('routes', response);
      notify('new-route', 'success', t('form.routes.create.success'));
      setIsCreatingRoute(false);
    } catch (err) {
      console.log(err);
      setIsCreatingRoute(false);
      notify('new-route', 'error', err.message || t('form.routes.create.error'));
    }
  };

  const handleRoutesReorder = async ({ destination, source }) => {
    if (!source || !destination || isReadOnly) return;
    form.reorderListItem('routes', { from: source.index, to: destination.index });
  };

  const handleOpenRoute = (route_id) => {
    router.push(`/dashboard/lines/${line_id}/${route_id}`);
  };

  //
  // E. Render components

  return (
    <Pannel
      loading={lineLoading || isDeleting}
      header={
        <>
          <AutoSave
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
          <LineDisplay short_name={form.values.short_name} long_name={form.values.long_name || t('untitled')} color={form.values.color} text_color={form.values.text_color} />
          <Tooltip label={t('operations.open_website.title')} color='blue' position='bottom' withArrow>
            <ActionIcon color='blue' variant='light' size='lg'>
              <IconExternalLink size='20px' />
            </ActionIcon>
          </Tooltip>
          <AuthGate scope='lines' permission='delete'>
            <Tooltip label={t('operations.delete.title')} color='red' position='bottom' withArrow>
              <ActionIcon color='red' variant='light' size='lg' onClick={handleDelete}>
                <IconTrash size='20px' />
              </ActionIcon>
            </Tooltip>
          </AuthGate>
        </>
      }
    >
      <form onSubmit={form.onSubmit(async () => await handleSave())}>
        <Section>
          <Text size='h2'>{t('sections.config.title')}</Text>
          <SimpleGrid cols={2}>
            <SimpleGrid cols={2}>
              <TextInput label={t('form.code.label')} placeholder={t('form.code.placeholder')} {...form.getInputProps('code')} readOnly={isReadOnly} />
              <TextInput label={t('form.short_name.label')} placeholder={t('form.short_name.placeholder')} {...form.getInputProps('short_name')} readOnly={isReadOnly} />
            </SimpleGrid>
            <TextInput label={t('form.long_name.label')} placeholder={t('form.long_name.placeholder')} {...form.getInputProps('long_name')} readOnly={isReadOnly} />
          </SimpleGrid>
          <SimpleGrid cols={2}>
            <ColorInput label={t('form.color.label')} placeholder={t('form.color.placeholder')} {...form.getInputProps('color')} readOnly={isReadOnly} />
            <ColorInput label={t('form.text_color.label')} placeholder={t('form.text_color.placeholder')} {...form.getInputProps('text_color')} readOnly={isReadOnly} />
          </SimpleGrid>
          <SimpleGrid cols={2}>
            <Select label={t('form.fare.label')} placeholder={t('form.fare.placeholder')} nothingFound={t('form.fare.nothingFound')} {...form.getInputProps('fare')} data={allFaresDataFormatted} readOnly={isReadOnly} searchable />
          </SimpleGrid>
          <SimpleGrid cols={1}>
            <Select
              label={t('form.agency.label')}
              description={t('form.agency.description')}
              placeholder={t('form.agency.placeholder')}
              nothingFound={t('form.agency.nothingFound')}
              {...form.getInputProps('agency')}
              data={allAgenciesDataFormatted}
              readOnly={isReadOnly}
              searchable
            />
          </SimpleGrid>
        </Section>
        <Divider />
        <Section>
          <Text size='h2'>{t('sections.routes.title')}</Text>
          <DragDropContext onDragEnd={handleRoutesReorder}>
            <Droppable droppableId='droppable'>
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {form.values.routes.map((item, index) => (
                    <RouteCard key={index} index={index} onOpen={handleOpenRoute} _id={item._id} code={item.code} name={item.name} />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <AuthGate scope='lines' permission='create_edit'>
            <Button onClick={handleAddRoute} loading={isCreatingRoute}>
              {t('form.routes.create.title')}
            </Button>
          </AuthGate>
        </Section>
      </form>
    </Pannel>
  );
}
