'use client';

import useSWR from 'swr';
import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next-intl/client';
import { yupResolver } from '@mantine/form';
import { FormProvider as LineFormProvider, useForm as useLineForm } from '@/schemas/Line/form';
import API from '@/services/API';
import { Validation as LineValidation } from '@/schemas/Line/validation';
import { Default as LineDefault } from '@/schemas/Line/default';
import { Options as LineOptions } from '@/schemas/Line/options';
import { Tooltip, Select, Button, SimpleGrid, TextInput, ActionIcon, Divider, Switch } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import Pannel from '@/components/Pannel/Pannel';
import Text from '@/components/Text/Text';
import { Section } from '@/components/Layouts/Layouts';
import AutoSave from '@/components/AutoSave/AutoSave';
import notify from '@/services/notify';
import { openConfirmModal } from '@mantine/modals';
import LineDisplay from '@/components/LineDisplay/LineDisplay';
import RouteCard from '@/components/RouteCard/RouteCard';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import AuthGate, { isAllowed } from '@/components/AuthGate/AuthGate';
import populate from '@/services/populate';
import LockButton from '@/components/LockButton/LockButton';

export default function Page() {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const t = useTranslations('lines');
  const [isSaving, setIsSaving] = useState(false);
  const [isLocking, setIsLocking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasErrorSaving, setHasErrorSaving] = useState();
  const [isCreatingRoute, setIsCreatingRoute] = useState(false);
  const { data: session } = useSession();

  const { line_id } = useParams();

  //
  // B. Fetch data

  const { mutate: allLinesMutate } = useSWR('/api/lines');
  const { data: lineData, error: lineError, isLoading: lineLoading, mutate: lineMutate } = useSWR(line_id && `/api/lines/${line_id}`, { onSuccess: (data) => keepFormUpdated(data) });
  const { data: allTypologiesData } = useSWR('/api/typologies');
  const { data: allFaresData } = useSWR('/api/fares');
  const { data: allAgenciesData } = useSWR('/api/agencies');

  //
  // C. Setup form

  const lineForm = useLineForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    clearInputErrorOnChange: true,
    validate: yupResolver(LineValidation),
    initialValues: populate(LineDefault, lineData),
  });

  const keepFormUpdated = (data) => {
    if (!lineForm.isDirty()) {
      const populated = populate(LineDefault, data);
      lineForm.setValues(populated);
      lineForm.resetDirty(populated);
    }
  };

  //
  // D. Setup readonly

  const isReadOnly = !isAllowed(session, 'lines', 'create_edit') || lineData?.is_locked;

  //
  // E. Transform data

  const allTypologiesDataFormatted = useMemo(() => {
    if (!allTypologiesData) return [];
    return allTypologiesData.map((item) => {
      return { value: item._id, label: item.name || '-' };
    });
  }, [allTypologiesData]);

  const allFaresDataFormatted = useMemo(() => {
    if (!allFaresData) return [];
    return allFaresData.map((item) => {
      return { value: item._id, label: `${item.name || '-'} (${item.currency_type} ${item.price})` };
    });
  }, [allFaresData]);

  const allAgenciesDataFormatted = useMemo(() => {
    if (!allAgenciesData) return [];
    return allAgenciesData.map((item) => {
      return { value: item._id, label: item.name || '-' };
    });
  }, [allAgenciesData]);

  const selectedLineTypologyData = useMemo(() => {
    return allTypologiesData && allTypologiesData.find((item) => item._id === lineForm.values.typology);
  }, [allTypologiesData, lineForm.values.typology]);

  //
  // F. Handle actions

  const handleValidate = () => {
    lineForm.validate();
  };

  const handleClose = async () => {
    router.push(`/dashboard/lines`);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await API({ service: 'lines', resourceId: line_id, operation: 'edit', method: 'PUT', body: lineForm.values });
      lineMutate();
      allLinesMutate();
      lineForm.resetDirty();
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

  const handleLock = async (value) => {
    try {
      setIsLocking(true);
      await API({ service: 'lines', resourceId: line_id, operation: 'lock', method: 'PUT', body: { is_locked: value } });
      lineMutate();
      setIsLocking(false);
    } catch (err) {
      console.log(err);
      lineMutate();
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

  const handleCreateRoute = async () => {
    try {
      setIsCreatingRoute(true);
      notify('new-route', 'loading', t('form.routes.create.loading'));
      const response = await API({ service: 'routes', operation: 'create', method: 'POST', body: { parent_line: line_id } });
      lineForm.insertListItem('routes', response._id);
      notify('new-route', 'success', t('form.routes.create.success'));
      setIsCreatingRoute(false);
    } catch (err) {
      console.log(err);
      setIsCreatingRoute(false);
      notify('new-route', 'error', err.message || t('form.routes.create.error'));
    }
  };

  const handleOpenRoute = (route_id) => {
    router.push(`/dashboard/lines/${line_id}/${route_id}`);
  };

  //
  // G. Render components

  return (
    <Pannel
      loading={lineLoading || isDeleting}
      header={
        <>
          <AutoSave
            isValid={lineForm.isValid()}
            isDirty={lineForm.isDirty()}
            isLoading={lineLoading}
            isErrorValidating={lineError}
            isSaving={isSaving}
            isErrorSaving={hasErrorSaving}
            onValidate={() => handleValidate()}
            onSave={async () => await handleSave()}
            onClose={async () => await handleClose()}
          />
          <LineDisplay short_name={lineForm.values.short_name} name={lineForm.values.name || t('untitled')} color={selectedLineTypologyData?.color} text_color={selectedLineTypologyData?.text_color} />
          <AuthGate scope="lines" permission="lock">
            <LockButton isLocked={lineData?.is_locked} setLocked={handleLock} loading={isLocking} />
          </AuthGate>
          <AuthGate scope="lines" permission="delete">
            <Tooltip label={t('operations.delete.title')} color="red" position="bottom" withArrow>
              <ActionIcon color="red" variant="light" size="lg" onClick={handleDelete}>
                <IconTrash size="20px" />
              </ActionIcon>
            </Tooltip>
          </AuthGate>
        </>
      }
    >
      <LineFormProvider form={lineForm}>
        <form onSubmit={lineForm.onSubmit(async () => await handleSave())}>
          <Section>
            <Text size="h2">{t('sections.config.title')}</Text>
            <SimpleGrid cols={2}>
              <TextInput label={t('form.code.label')} placeholder={t('form.code.placeholder')} {...lineForm.getInputProps('code')} readOnly={isReadOnly} />
              <TextInput label={t('form.short_name.label')} placeholder={t('form.short_name.placeholder')} {...lineForm.getInputProps('short_name')} readOnly={isReadOnly} />
            </SimpleGrid>
            <SimpleGrid cols={1}>
              <TextInput label={t('form.name.label')} placeholder={t('form.name.placeholder')} {...lineForm.getInputProps('name')} readOnly={isReadOnly} />
            </SimpleGrid>
            <SimpleGrid cols={2}>
              <Select
                label={t('form.typology.label')}
                placeholder={t('form.typology.placeholder')}
                nothingFound={t('form.typology.nothingFound')}
                {...lineForm.getInputProps('typology')}
                data={allTypologiesDataFormatted}
                readOnly={isReadOnly}
                searchable
              />
              <Select label={t('form.fare.label')} placeholder={t('form.fare.placeholder')} nothingFound={t('form.fare.nothingFound')} {...lineForm.getInputProps('fare')} data={allFaresDataFormatted} readOnly={isReadOnly} searchable />
              <Select label={t('form.agency.label')} placeholder={t('form.agency.placeholder')} nothingFound={t('form.agency.nothingFound')} {...lineForm.getInputProps('agency')} data={allAgenciesDataFormatted} readOnly={isReadOnly} searchable />
              <Select
                label={t('form.transport_type.label')}
                placeholder={t('form.transport_type.placeholder')}
                nothingFound={t('form.transport_type.nothingFound')}
                {...lineForm.getInputProps('transport_type')}
                data={LineOptions.transport_type.map((item) => {
                  return { value: item, label: t(`form.transport_type.options.${item}.label`) };
                })}
                readOnly={isReadOnly}
                searchable
              />
            </SimpleGrid>
          </Section>

          <Divider />

          <Section>
            <SimpleGrid cols={3}>
              <Switch label={t('form.circular.label')} size="md" {...lineForm.getInputProps('circular', { type: 'checkbox' })} readOnly={isReadOnly} />
              <Switch label={t('form.school.label')} size="md" {...lineForm.getInputProps('school', { type: 'checkbox' })} readOnly={isReadOnly} />
              <Switch label={t('form.continuous.label')} size="md" {...lineForm.getInputProps('continuous', { type: 'checkbox' })} readOnly={isReadOnly} />
            </SimpleGrid>
          </Section>

          <Divider />

          <Section>
            <div>
              <Text size="h2">{t('sections.routes.title')}</Text>
              <Text size="h4">{t('sections.routes.description')}</Text>
            </div>
            <div>
              {lineForm.values.routes.map((route_id, index) => (
                <RouteCard key={index} _id={route_id} onClick={handleOpenRoute} />
              ))}
            </div>
            <AuthGate scope="lines" permission="create_edit">
              <Button onClick={handleCreateRoute} loading={isCreatingRoute} disabled={lineForm.isDirty() || !lineForm.isValid() || isReadOnly}>
                {t('form.routes.create.title')}
              </Button>
            </AuthGate>
          </Section>
        </form>
      </LineFormProvider>
    </Pannel>
  );
}
