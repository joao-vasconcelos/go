'use client';

import useSWR from 'swr';
import { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next-intl/client';
import { yupResolver } from '@mantine/form';
import API from '@/services/API';
import { FormProvider as RouteFormProvider, useForm as useRouteForm } from '@/schemas/Route/form';
import { Validation as RouteValidation } from '@/schemas/Route/validation';
import { Default as RouteDefault } from '@/schemas/Route/default';
import { Options as RouteOptions } from '@/schemas/Route/options';
import { Tooltip, Button, SimpleGrid, TextInput, ActionIcon, Divider, Select } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import Pannel from '@/components/Pannel/Pannel';
import Text from '@/components/Text/Text';
import { Section } from '@/components/Layouts/Layouts';
import AutoSave from '@/components/AutoSave/AutoSave';
import notify from '@/services/notify';
import { openConfirmModal } from '@mantine/modals';
import LineDisplay from '@/components/LineDisplay/LineDisplay';
import PatternCard from '@/components/PatternCard/PatternCard';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import AuthGate, { isAllowed } from '@/components/AuthGate/AuthGate';
import { create } from 'lodash';

export default function Page() {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const t = useTranslations('routes');
  const [isSaving, setIsSaving] = useState(false);
  const [hasErrorSaving, setHasErrorSaving] = useState();
  const [isCreatingPattern, setIsCreatingPattern] = useState(false);
  const { data: session } = useSession();
  const isReadOnly = !isAllowed(session, 'lines', 'create_edit');

  const { line_id, route_id } = useParams();

  //
  // B. Fetch data

  const { data: lineData } = useSWR(line_id && `/api/lines/${line_id}`);
  const { data: routeData, error: routeError, isLoading: routeLoading, mutate: routeMutate } = useSWR(route_id && `/api/routes/${route_id}`, { onSuccess: (data) => keepFormUpdated(data) });
  const { data: typologyData } = useSWR(lineData && lineData.typology && `/api/typologies/${lineData.typology}`);

  //
  // C. Setup form

  const routeForm = useRouteForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    clearInputErrorOnChange: true,
    validate: yupResolver(RouteValidation),
    initialValues: create({ ...RouteDefault }, { ...routeData }),
  });

  const keepFormUpdated = (data) => {
    if (!routeForm.isDirty()) {
      const document = create({ ...RouteDefault }, { ...data });
      routeForm.setValues(document);
      routeForm.resetDirty(document);
    }
  };

  //
  // D. Handle actions

  const handleValidate = () => {
    routeForm.validate();
  };

  const handleClose = async () => {
    router.push(`/dashboard/lines/${line_id}`);
  };

  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);
      await API({ service: 'routes', resourceId: route_id, operation: 'edit', method: 'PUT', body: routeForm.values });
      routeMutate();
      routeForm.resetDirty();
      setIsSaving(false);
      setHasErrorSaving(false);
    } catch (err) {
      console.log(err);
      setIsSaving(false);
      setHasErrorSaving(err);
    }
  }, [route_id, routeForm, routeMutate]);

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
          router.push(`/dashboard/lines/${line_id}`);
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
      const response = await API({ service: 'patterns', operation: 'create', method: 'POST', body: { code: `${routeData.code}_${routeForm.values.patterns.length}`, parent_route: route_id, direction: routeForm.values.patterns.length } });
      routeForm.insertListItem('patterns', response._id);
      notify('new-pattern', 'success', 'Pattern criado com sucesso.');
      setIsCreatingPattern(false);
    } catch (err) {
      setIsCreatingPattern(false);
      console.log(err);
      notify('new-pattern', 'error', err.message);
    }
  };

  const handlePatternsReorder = async ({ destination, source }) => {
    if (!source || !destination || isReadOnly) return;
    routeForm.reorderListItem('patterns', { from: source.index, to: destination.index });
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
          <AutoSave
            isValid={routeForm.isValid()}
            isDirty={routeForm.isDirty()}
            isLoading={routeLoading}
            isErrorValidating={routeError}
            isSaving={isSaving}
            isErrorSaving={hasErrorSaving}
            onValidate={() => handleValidate()}
            onSave={async () => await handleSave()}
            onClose={async () => await handleClose()}
            closeType='back'
          />
          <LineDisplay short_name={lineData && lineData.short_name} name={routeForm.values.name || t('untitled')} color={typologyData && typologyData.color} text_color={typologyData && typologyData.text_color} />
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
      <RouteFormProvider form={routeForm}>
        <form onSubmit={routeForm.onSubmit(async () => await handleSave())}>
          <Section>
            <Text size='h2'>{t('sections.config.title')}</Text>
            <SimpleGrid cols={4}>
              <TextInput label={t('form.code.label')} placeholder={t('form.code.placeholder')} {...routeForm.getInputProps('code')} readOnly={isReadOnly} />
            </SimpleGrid>
            <SimpleGrid cols={2}>
              <TextInput label={t('form.name.label')} placeholder={t('form.name.placeholder')} {...routeForm.getInputProps('name')} readOnly={isReadOnly} />
              <Select
                label={t('form.path_type.label')}
                placeholder={t('form.path_type.placeholder')}
                nothingFound={t('form.path_type.nothingFound')}
                {...routeForm.getInputProps('path_type')}
                data={RouteOptions.path_type.map((item) => {
                  return { value: item, label: t(`form.path_type.options.${item}.label`) };
                })}
                readOnly={isReadOnly}
                searchable
              />
            </SimpleGrid>
          </Section>
          <Divider />
          <Section>
            <Text size='h2'>{t('sections.patterns.title')}</Text>
            <div>
              {routeForm.values.patterns.map((patternId, index) => (
                <PatternCard key={index} _id={patternId} onClick={handleOpenPattern} />
              ))}
            </div>
            <AuthGate scope='lines' permission='create_edit'>
              <Button onClick={handleCreatePattern} loading={isCreatingPattern} disabled={routeForm.values.patterns.length > 1}>
                {t('form.patterns.create.title')}
              </Button>
            </AuthGate>
          </Section>
        </form>
      </RouteFormProvider>
    </Pannel>
  );
}
