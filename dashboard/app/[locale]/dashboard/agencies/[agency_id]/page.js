'use client';

import useSWR from 'swr';
import { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next-intl/client';
import { useForm, yupResolver } from '@mantine/form';
import API from '@/services/API';
import { AgencyValidation } from '@/schemas/Agency/validation';
import { AgencyDefault } from '@/schemas/Agency/default';
import { Tooltip, Select, SimpleGrid, TextInput, ActionIcon, NumberInput, Divider } from '@mantine/core';
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

export default function Page() {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const t = useTranslations('agencies');
  const [isSaving, setIsSaving] = useState(false);
  const [hasErrorSaving, setHasErrorSaving] = useState();
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: session } = useSession();
  const isReadOnly = !isAllowed(session, 'agencies', 'create_edit');

  const { agency_id } = useParams();

  //
  // B. Fetch data

  const { mutate: allAgenciesMutate } = useSWR('/api/agencies');
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
      allAgenciesMutate();
      form.resetDirty();
      setIsSaving(false);
      setHasErrorSaving(false);
    } catch (err) {
      console.log(err);
      setIsSaving(false);
      setHasErrorSaving(err);
    }
  }, [agency_id, form, allAgenciesMutate]);

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
          notify(agency_id, 'loading', t('operations.delete.loading'));
          await API({ service: 'agencies', resourceId: agency_id, operation: 'delete', method: 'DELETE' });
          allAgenciesMutate();
          router.push('/dashboard/agencies');
          notify(agency_id, 'success', t('operations.delete.success'));
          setIsDeleting(false);
        } catch (err) {
          console.log(err);
          setIsDeleting(false);
          notify(agency_id, 'error', err.message || t('operations.delete.error'));
        }
      },
    });
  };

  //
  // E. Render components

  return (
    <Pannel
      loading={agencyLoading || isDeleting}
      header={
        <>
          <AutoSave
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
          <Text size='h1' style={!form.values.name && 'untitled'} full>
            {form.values.name || t('untitled')}
          </Text>
          <AuthGate scope='agencies' permission='delete'>
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
            <Text size='h2'>{t('sections.config.title')}</Text>
            <Text size='h4'>{t('sections.config.description')}</Text>
          </div>
          <SimpleGrid cols={1}>
            <TextInput label={t('form.name.label')} placeholder={t('form.name.placeholder')} {...form.getInputProps('name')} readOnly={isReadOnly} />
          </SimpleGrid>
          <SimpleGrid cols={3}>
            <TextInput label={t('form.code.label')} placeholder={t('form.code.placeholder')} {...form.getInputProps('code')} readOnly={isReadOnly} />
            <Select
              label={t('form.lang.label')}
              placeholder={t('form.lang.placeholder')}
              nothingFound={t('form.lang.nothingFound')}
              data={[{ value: 'pt', label: 'Português (Portugal)' }]}
              {...form.getInputProps('lang')}
              searchable
              readOnly={isReadOnly}
            />
            <Select label={t('form.timezone.label')} placeholder={t('form.timezone.placeholder')} nothingFound={t('form.timezone.nothingFound')} data={['Europe/Lisbon']} {...form.getInputProps('timezone')} searchable readOnly={isReadOnly} />
          </SimpleGrid>
          <SimpleGrid cols={2}>
            <TextInput label={t('form.phone.label')} placeholder={t('form.phone.placeholder')} {...form.getInputProps('phone')} readOnly={isReadOnly} />
            <TextInput label={t('form.email.label')} placeholder={t('form.email.placeholder')} {...form.getInputProps('email')} readOnly={isReadOnly} />
          </SimpleGrid>
          <SimpleGrid cols={2}>
            <TextInput label={t('form.url.label')} placeholder={t('form.url.placeholder')} {...form.getInputProps('url')} readOnly={isReadOnly} />
            <TextInput label={t('form.fare_url.label')} placeholder={t('form.fare_url.placeholder')} {...form.getInputProps('fare_url')} readOnly={isReadOnly} />
          </SimpleGrid>
        </Section>
        <Divider />
        <Section>
          <div>
            <Text size='h2'>{t('sections.financials.title')}</Text>
            <Text size='h4'>{t('sections.financials.description')}</Text>
          </div>
          <SimpleGrid cols={2}>
            <NumberInput
              label={t('form.price_per_km.label')}
              description={t('form.price_per_km.description')}
              placeholder={t('form.price_per_km.placeholder')}
              {...form.getInputProps('price_per_km')}
              precision={2}
              min={0}
              step={0.01}
              stepHoldDelay={500}
              stepHoldInterval={100}
              parser={(value) => (isNaN(Number(value)) ? 0 : Number(value))}
              formatter={(value) => (!Number.isNaN(parseFloat(value)) ? `€ ${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',') : '€ ')}
              readOnly={isReadOnly}
            />
          </SimpleGrid>
        </Section>
      </form>
    </Pannel>
  );
}
