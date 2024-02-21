'use client';

import useSWR from 'swr';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from '@/translations/navigation';
import { yupResolver } from '@mantine/form';
import API from '@/services/API';
import { RouteFormProvider, useRouteForm } from '@/schemas/Route/form';
import { RouteValidation } from '@/schemas/Route/validation';
import { RouteDefault } from '@/schemas/Route/default';
import { RouteOptions } from '@/schemas/Route/options';
import { Tooltip, Button, SimpleGrid, TextInput, ActionIcon, Divider, Select, JsonInput } from '@mantine/core';
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
import isAllowed from '@/authentication/isAllowed';
import populate from '@/services/populate';
import LockButton from '@/components/LockButton/LockButton';
import ListHeader from '@/components/ListHeader/ListHeader';
import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';

export default function Page() {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const t = useTranslations('routes');
  const [isSaving, setIsSaving] = useState(false);
  const [isLocking, setIsLocking] = useState(false);
  const [hasErrorSaving, setHasErrorSaving] = useState();
  const [isCreatingPattern, setIsCreatingPattern] = useState(false);
  const { data: sessionData } = useSession();

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
    initialValues: populate(RouteDefault, routeData),
  });

  const keepFormUpdated = (data) => {
    if (!routeForm.isDirty()) {
      const populated = populate(RouteDefault, data);
      routeForm.setValues(populated);
      routeForm.resetDirty(populated);
    }
  };

  //
  // D. Setup readonly

  const isReadOnly = !isAllowed(sessionData, [{ scope: 'lines', action: 'edit' }], { handleError: true }) || lineData?.is_locked || routeData?.is_locked;

  //
  // E. Handle actions

  const handleValidate = () => {
    routeForm.validate();
  };

  const handleClose = async () => {
    router.push(`/lines/${line_id}`);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await API({ service: 'routes', resourceId: route_id, operation: 'edit', method: 'PUT', body: routeForm.values });
      routeMutate();
      routeForm.resetDirty();
      setIsSaving(false);
      setIsLocking(false);
      setHasErrorSaving(false);
    } catch (err) {
      console.log(err);
      setIsSaving(false);
      setIsLocking(false);
      setHasErrorSaving(err);
    }
  };

  const handleLock = async () => {
    try {
      setIsLocking(true);
      await API({ service: 'routes', resourceId: route_id, operation: 'lock', method: 'PUT' });
      routeMutate();
      setIsLocking(false);
    } catch (err) {
      console.log(err);
      routeMutate();
      setIsLocking(false);
    }
  };

  const handleDelete = async () => {
    openConfirmModal({
      title: <Text size="h2">{t('operations.delete.title')}</Text>,
      centered: true,
      closeOnClickOutside: true,
      children: <Text size="h3">{t('operations.delete.description')}</Text>,
      labels: { confirm: t('operations.delete.confirm'), cancel: t('operations.delete.cancel') },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          notify(route_id, 'loading', t('operations.delete.loading'));
          await API({ service: 'routes', resourceId: route_id, operation: 'delete', method: 'DELETE' });
          router.push(`/lines/${line_id}`);
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
      const response = await API({ service: 'patterns', operation: 'create', method: 'POST', body: { code: `${routeData.code}_${routeForm.values.patterns.length}`, parent_route: route_id } });
      routeForm.insertListItem('patterns', response._id);
      notify('new-pattern', 'success', 'Pattern criado com sucesso.');
      setIsCreatingPattern(false);
    } catch (err) {
      setIsCreatingPattern(false);
      console.log(err);
      notify('new-pattern', 'error', err.message);
    }
  };

  const handleOpenPattern = (pattern_id) => {
    router.push(`/lines/${line_id}/${route_id}/${pattern_id}`);
  };

  //
  // E. Render components

  return (
    <Pannel
      loading={routeLoading}
      header={
        <ListHeader>
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
            closeType="back"
          />
          <LineDisplay short_name={lineData && lineData.short_name} name={routeForm.values.name || t('untitled')} color={typologyData && typologyData.color} text_color={typologyData && typologyData.text_color} />
          <AppAuthenticationCheck permissions={[{ scope: 'lines', action: 'lock' }]}>
            <LockButton isLocked={routeData?.is_locked} onClick={handleLock} loading={isLocking} disabled={lineData?.is_locked} />
          </AppAuthenticationCheck>
          <AppAuthenticationCheck permissions={[{ scope: 'lines', action: 'delete' }]}>
            <Tooltip label={t('operations.delete.title')} color="red" position="bottom" withArrow>
              <ActionIcon color="red" variant="light" size="lg" onClick={handleDelete}>
                <IconTrash size="20px" />
              </ActionIcon>
            </Tooltip>
          </AppAuthenticationCheck>
        </ListHeader>
      }
    >
      <RouteFormProvider form={routeForm}>
        <form onSubmit={routeForm.onSubmit(async () => await handleSave())}>
          <Section>
            <Text size="h2">{t('sections.config.title')}</Text>
            <SimpleGrid cols={4}>
              <TextInput label={t('form.code.label')} placeholder={t('form.code.placeholder')} {...routeForm.getInputProps('code')} readOnly={isReadOnly} />
            </SimpleGrid>
            <SimpleGrid cols={2}>
              <TextInput label={t('form.name.label')} placeholder={t('form.name.placeholder')} {...routeForm.getInputProps('name')} readOnly={isReadOnly} />
              <Select
                label={t('form.path_type.label')}
                placeholder={t('form.path_type.placeholder')}
                nothingFoundMessage={t('form.path_type.nothingFound')}
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
            <Text size="h2">{t('sections.patterns.title')}</Text>
            <div>
              {routeForm.values.patterns.map((patternId, index) => (
                <PatternCard key={index} _id={patternId} onClick={handleOpenPattern} />
              ))}
            </div>
            <AppAuthenticationCheck permissions={[{ scope: 'lines', action: 'edit' }]}>
              <Button onClick={handleCreatePattern} loading={isCreatingPattern} disabled={routeForm.values.patterns.length > 1 || isReadOnly}>
                {t('form.patterns.create.title')}
              </Button>
            </AppAuthenticationCheck>
          </Section>
          <AppAuthenticationCheck permissions={[{ scope: 'configs', action: 'debug' }]}>
            <Divider />
            <Section>
              <Text size="h2">{t('sections.debug.title')}</Text>
              <JsonInput value={JSON.stringify(routeData)} rows={20} />
            </Section>
          </AppAuthenticationCheck>
        </form>
      </RouteFormProvider>
    </Pannel>
  );
}
