'use client';

import useSWR from 'swr';
import { useState, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next-intl/client';
import { useForm, yupResolver } from '@mantine/form';
import API from '@/services/API';
import { AlertValidation } from '@/schemas/Alert/validation';
import { AlertDefault } from '@/schemas/Alert/default';
import { AlertOptions } from '@/schemas/Alert/options';
import { Tooltip, Select, SimpleGrid, TextInput, ActionIcon, Switch, Divider, Textarea, MultiSelect } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import Pannel from '@/components/Pannel/Pannel';
import Text from '@/components/Text/Text';
import { Section } from '@/components/Layouts/Layouts';
import AutoSave from '@/components/AutoSave/AutoSave';
import notify from '@/services/notify';
import { openConfirmModal } from '@mantine/modals';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import AuthGate, { isAllowed } from '@/components/AuthGate/AuthGate';
import populate from '@/services/populate';
import { DateTimePicker } from '@mantine/dates';

export default function Page() {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const t = useTranslations('alerts');
  const alertOptionsTranslations = useTranslations('AlertOptions');
  const [isSaving, setIsSaving] = useState(false);
  const [hasErrorSaving, setHasErrorSaving] = useState();
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: session } = useSession();
  const isReadOnly = !isAllowed(session, 'alerts', 'create_edit');

  const { alert_id } = useParams();

  //
  // B. Fetch data

  const { mutate: allAlertsMutate } = useSWR('/api/alerts');
  const { data: alertData, error: alertError, isLoading: alertLoading } = useSWR(alert_id && `/api/alerts/${alert_id}`, { onSuccess: (data) => keepFormUpdated(data) });
  const { data: allMunicipalitiesData } = useSWR('/api/municipalities');
  const { data: allLinesData } = useSWR('/api/lines');
  const { data: allStopsData } = useSWR('/api/stops');

  //
  // C. Setup form

  const form = useForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    clearInputErrorOnChange: true,
    validate: yupResolver(AlertValidation),
    initialValues: AlertDefault,
  });

  const keepFormUpdated = (data) => {
    if (!form.isDirty()) {
      const populated = populate(AlertDefault, data);
      form.setValues(populated);
      form.resetDirty(populated);
    }
  };

  //
  // D. Handle actions

  const availableCauses = useMemo(() => {
    if (!AlertOptions.cause) return [];
    return AlertOptions.cause.map((item) => {
      return { value: item, label: alertOptionsTranslations(`cause.${item}.label`) };
    });
  }, [alertOptionsTranslations]);

  const availableEffects = useMemo(() => {
    if (!AlertOptions.effect) return [];
    return AlertOptions.effect.map((item) => {
      return { value: item, label: alertOptionsTranslations(`effect.${item}.label`) };
    });
  }, [alertOptionsTranslations]);

  const availableMunicipalities = useMemo(() => {
    if (!allMunicipalitiesData) return [];
    return allMunicipalitiesData.map((item) => {
      return { value: item._id, label: item.name };
    });
  }, [allMunicipalitiesData]);

  const availableLines = useMemo(() => {
    if (!allLinesData) return [];
    return allLinesData.map((item) => {
      return { value: item._id, label: `[${item.short_name}] ${item.name}` };
    });
  }, [allLinesData]);

  const availableStops = useMemo(() => {
    if (!allStopsData) return [];
    return allStopsData.map((item) => {
      return { value: item._id, label: `[${item.code}] ${item.name}` };
    });
  }, [allStopsData]);

  //
  // D. Handle actions

  const handleValidate = () => {
    form.validate();
  };

  const handleClose = async () => {
    router.push(`/dashboard/alerts/`);
  };

  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);
      await API({ service: 'alerts', resourceId: alert_id, operation: 'edit', method: 'PUT', body: form.values });
      allAlertsMutate();
      form.resetDirty();
      setIsSaving(false);
      setHasErrorSaving(false);
    } catch (err) {
      console.log(err);
      setIsSaving(false);
      setHasErrorSaving(err);
    }
  }, [alert_id, form, allAlertsMutate]);

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
          notify(alert_id, 'loading', t('operations.delete.loading'));
          await API({ service: 'alerts', resourceId: alert_id, operation: 'delete', method: 'DELETE' });
          allAlertsMutate();
          router.push('/dashboard/alerts');
          notify(alert_id, 'success', t('operations.delete.success'));
          setIsDeleting(false);
        } catch (err) {
          console.log(err);
          setIsDeleting(false);
          notify(alert_id, 'error', err.message || t('operations.delete.error'));
        }
      },
    });
  };

  //
  // E. Render components

  return (
    <Pannel
      loading={alertLoading || isDeleting}
      header={
        <>
          <AutoSave
            isValid={form.isValid()}
            isDirty={form.isDirty()}
            isLoading={alertLoading}
            isErrorValidating={alertError}
            isSaving={isSaving}
            isErrorSaving={hasErrorSaving}
            onValidate={() => handleValidate()}
            onSave={async () => await handleSave()}
            onClose={async () => await handleClose()}
          />
          <Text size='h1' style={!form.values.title && 'untitled'} full>
            {form.values.title || t('untitled')}
          </Text>
          <AuthGate scope='alerts' permission='delete'>
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
          <div>
            <Text size='h2'>{t('sections.status.title')}</Text>
            <Text size='h4'>{t('sections.status.description')}</Text>
          </div>
          <SimpleGrid cols={1}>
            <Switch label={t('form.published.label')} description={t('form.published.description')} {...form.getInputProps('published', { type: 'checkbox' })} readOnly={isReadOnly} />
          </SimpleGrid>
        </Section>

        <Divider />

        <Section>
          <div>
            <Text size='h2'>{t('sections.messages.title')}</Text>
            <Text size='h4'>{t('sections.messages.description')}</Text>
          </div>
          <SimpleGrid cols={1}>
            <TextInput label={t('form.title.label')} placeholder={t('form.title.placeholder')} description={t('form.title.description')} {...form.getInputProps('title')} readOnly={isReadOnly} />
            <Textarea label={t('form.description.label')} placeholder={t('form.description.placeholder')} description={t('form.description.description')} {...form.getInputProps('description')} readOnly={isReadOnly} autosize minRows={3} />
          </SimpleGrid>
        </Section>

        <Divider />

        <Section>
          <div>
            <Text size='h2'>{t('sections.cause_effect.title')}</Text>
            <Text size='h4'>{t('sections.cause_effect.description')}</Text>
          </div>
          <SimpleGrid cols={2}>
            <Select
              label={t('form.cause.label')}
              placeholder={t('form.cause.placeholder')}
              description={t('form.cause.description')}
              nothingFound={t('form.cause.nothingFound')}
              {...form.getInputProps('cause')}
              data={availableCauses}
              readOnly={isReadOnly}
              searchable
            />
            <Select
              label={t('form.effect.label')}
              placeholder={t('form.effect.placeholder')}
              description={t('form.effect.description')}
              nothingFound={t('form.effect.nothingFound')}
              {...form.getInputProps('effect')}
              data={availableEffects}
              readOnly={isReadOnly}
              searchable
            />
          </SimpleGrid>
        </Section>

        <Divider />

        <Section>
          <div>
            <Text size='h2'>{t('sections.references.title')}</Text>
            <Text size='h4'>{t('sections.references.description')}</Text>
          </div>
          <SimpleGrid cols={1}>
            <MultiSelect
              label={t('form.municipalities.label')}
              placeholder={t('form.municipalities.placeholder')}
              description={t('form.municipalities.description')}
              nothingFound={t('form.municipalities.nothingFound')}
              {...form.getInputProps('municipalities')}
              data={availableMunicipalities}
              readOnly={isReadOnly}
              searchable
              clearable
            />
            <MultiSelect
              label={t('form.lines.label')}
              placeholder={t('form.lines.placeholder')}
              description={t('form.lines.description')}
              nothingFound={t('form.lines.nothingFound')}
              {...form.getInputProps('lines')}
              data={availableLines}
              readOnly={isReadOnly}
              searchable
              clearable
            />
            <MultiSelect
              label={t('form.stops.label')}
              placeholder={t('form.stops.placeholder')}
              description={t('form.stops.description')}
              nothingFound={t('form.stops.nothingFound')}
              {...form.getInputProps('stops')}
              data={availableStops}
              readOnly={isReadOnly}
              searchable
              clearable
            />
          </SimpleGrid>
        </Section>

        <Divider />

        <Section>
          <div>
            <Text size='h2'>{t('sections.active_period.title')}</Text>
            <Text size='h4'>{t('sections.active_period.description')}</Text>
          </div>
          <SimpleGrid cols={2}>
            <DateTimePicker
              dropdownType='modal'
              label={t('form.active_period_start.label')}
              placeholder={t('form.active_period_start.placeholder')}
              description={t('form.active_period_start.description')}
              {...form.getInputProps('active_period_start')}
              value={new Date(form.values.active_period_start)}
              readOnly={isReadOnly}
              clearable
            />
            <DateTimePicker
              dropdownType='modal'
              label={t('form.active_period_end.label')}
              placeholder={t('form.active_period_end.placeholder')}
              description={t('form.active_period_end.description')}
              {...form.getInputProps('active_period_end')}
              value={new Date(form.values.active_period_end)}
              readOnly={isReadOnly}
              clearable
            />
          </SimpleGrid>
        </Section>

        <Divider />

        <Section>
          <div>
            <Text size='h2'>{t('sections.media.title')}</Text>
            <Text size='h4'>{t('sections.media.description')}</Text>
          </div>
          <SimpleGrid cols={2}></SimpleGrid>
        </Section>
      </form>
    </Pannel>
  );
}
