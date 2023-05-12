'use client';

import useSWR from 'swr';
import { useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, yupResolver } from '@mantine/form';
import API from '../../../../../services/API';
import { Validation as AgencyValidation } from '../../../../../schemas/Agency/validation';
import { Default as AgencyDefault } from '../../../../../schemas/Agency/default';
import { Tooltip, Select, SimpleGrid, TextInput, ActionIcon } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import Pannel from '../../../../../components/Pannel/Pannel';
import Text from '../../../../../components/Text/Text';
import { Section } from '../../../../../components/Layouts/Layouts';
import SaveButtons from '../../../../../components/SaveButtons';
import notify from '../../../../../services/notify';
import { openConfirmModal } from '@mantine/modals';
import { useTranslations } from 'next-intl';

export default function Page() {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const t = useTranslations('agencies');
  const [isSaving, setIsSaving] = useState(false);
  const [hasErrorSaving, setHasErrorSaving] = useState();

  const { agency_id } = useParams();

  //
  // B. Fetch data

  const { data: agencyData, error: agencyError, isLoading: agencyLoading } = useSWR(agency_id && `/api/agencies/${agency_id}`, { onSuccess: (data) => keepFormUpdated(data) });

  //
  // C. Setup form

  const form = useForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    clearInputErrorOnChange: true,
    validate: yupResolver(AgencyValidation),
    initialValues: agencyData || AgencyDefault,
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
    router.push(`/dashboard/agencies/`);
  };

  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);
      await API({ service: 'agencies', resourceId: agency_id, operation: 'edit', method: 'PUT', body: form.values });
      form.resetDirty();
      setIsSaving(false);
      setHasErrorSaving(false);
    } catch (err) {
      console.log(err);
      setIsSaving(false);
      setHasErrorSaving(err);
    }
  }, [agency_id, form]);

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
          notify(agency_id, 'loading', t('operations.delete.loading'));
          await API({ service: 'agencies', resourceId: agency_id, operation: 'delete', method: 'DELETE' });
          router.push('/dashboard/agencies');
          notify(agency_id, 'success', t('operations.delete.success'));
        } catch (err) {
          console.log(err);
          notify(agency_id, 'error', err.message || t('operations.delete.error'));
        }
      },
    });
  };

  //
  // E. Render components

  return (
    <Pannel
      loading={agencyLoading}
      header={
        <>
          <SaveButtons
            isValid={form.isValid()}
            isDirty={form.isDirty()}
            isLoading={agencyLoading}
            isErrorValidating={agencyError}
            isSaving={isSaving}
            isErrorSaving={hasErrorSaving}
            onValidate={() => handleValidate()}
            onSave={async () => await handleSave()}
            onClose={async () => await handleClose()}
          />
          <Text size='h1' style={!form.values.agency_name && 'untitled'} full>
            {form.values.agency_name || t('untitled')}
          </Text>
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
            <TextInput label={t('form.agency_name.label')} placeholder={t('form.agency_name.placeholder')} {...form.getInputProps('agency_name')} />
          </SimpleGrid>
          <SimpleGrid cols={3}>
            <TextInput label={t('form.agency_code.label')} placeholder={t('form.agency_code.placeholder')} {...form.getInputProps('agency_code')} />
            <Select
              label={t('form.agency_lang.label')}
              placeholder={t('form.agency_lang.placeholder')}
              nothingFound={t('form.agency_lang.nothingFound')}
              data={[{ value: 'pt', label: 'Português (Portugal)' }]}
              {...form.getInputProps('agency_lang')}
              searchable
            />
            <Select label={t('form.agency_timezone.label')} placeholder={t('form.agency_timezone.placeholder')} nothingFound={t('form.agency_timezone.nothingFound')} data={['Europe/Lisbon']} {...form.getInputProps('agency_timezone')} searchable />
          </SimpleGrid>
          <SimpleGrid cols={2}>
            <TextInput label={t('form.agency_phone.label')} placeholder={t('form.agency_phone.placeholder')} {...form.getInputProps('agency_phone')} />
            <TextInput label={t('form.agency_email.label')} placeholder={t('form.agency_email.placeholder')} {...form.getInputProps('agency_email')} />
          </SimpleGrid>
          <SimpleGrid cols={2}>
            <TextInput label={t('form.agency_url.label')} placeholder={t('form.agency_url.placeholder')} {...form.getInputProps('agency_url')} />
            <TextInput label={t('form.agency_fare_url.label')} placeholder={t('form.agency_fare_url.placeholder')} {...form.getInputProps('agency_fare_url')} />
          </SimpleGrid>
        </Section>
      </form>
    </Pannel>
  );
}
