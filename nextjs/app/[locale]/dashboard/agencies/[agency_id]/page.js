'use client';

import useSWR from 'swr';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from '@/translations/navigation';
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
import populate from '@/services/populate';
import LockButton from '@/components/LockButton/LockButton';
import { DatePickerInput } from '@mantine/dates';
import parseDate from '@/services/parseDate';
import parseStringToDate from '@/services/parseStringToDate';

export default function Page() {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const t = useTranslations('agencies');
  const [isSaving, setIsSaving] = useState(false);
  const [isLocking, setIsLocking] = useState(false);
  const [hasErrorSaving, setHasErrorSaving] = useState();
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: session } = useSession();

  const { agency_id } = useParams();

  //
  // B. Fetch data

  const { mutate: allAgenciesMutate } = useSWR('/api/agencies');
  const { data: agencyData, error: agencyError, isLoading: agencyLoading, mutate: agencyMutate } = useSWR(agency_id && `/api/agencies/${agency_id}`, { onSuccess: (data) => keepFormUpdated(data) });

  //
  // C. Setup form

  const form = useForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    clearInputErrorOnChange: true,
    validate: yupResolver(AgencyValidation),
    initialValues: populate(AgencyDefault, agencyData),
  });

  const keepFormUpdated = (data) => {
    if (!form.isDirty()) {
      const populated = populate(AgencyDefault, data);
      form.setValues(populated);
      form.resetDirty(populated);
    }
  };

  //
  // D. Setup readonly

  const isReadOnly = !isAllowed(session, 'agencies', 'create_edit') || agencyData?.is_locked;

  //
  // E. Handle actions

  const handleValidate = () => {
    form.validate();
  };

  const handleClose = async () => {
    router.push(`/dashboard/agencies/`);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await API({ service: 'agencies', resourceId: agency_id, operation: 'edit', method: 'PUT', body: form.values });
      agencyMutate();
      allAgenciesMutate();
      form.resetDirty();
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
      await API({ service: 'agencies', resourceId: agency_id, operation: 'lock', method: 'PUT', body: { is_locked: value } });
      agencyMutate();
      setIsLocking(false);
    } catch (err) {
      console.log(err);
      agencyMutate();
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
  // F. Render components

  return (
    <Pannel
      loading={agencyLoading || isDeleting}
      header={
        <>
          <AutoSave isValid={form.isValid()} isDirty={form.isDirty()} isLoading={agencyLoading} isErrorValidating={agencyError} isSaving={isSaving} isErrorSaving={hasErrorSaving} onValidate={() => handleValidate()} onSave={async () => await handleSave()} onClose={async () => await handleClose()} />
          <Text size="h1" style={!form.values.name && 'untitled'} full>
            {form.values.name || t('untitled')}
          </Text>
          <AuthGate scope="agencies" permission="lock">
            <LockButton isLocked={agencyData?.is_locked} setLocked={handleLock} loading={isLocking} />
          </AuthGate>
          <AuthGate scope="agencies" permission="delete">
            <Tooltip label={t('operations.delete.title')} color="red" position="bottom" withArrow>
              <ActionIcon color="red" variant="light" size="lg" onClick={handleDelete}>
                <IconTrash size={20} />
              </ActionIcon>
            </Tooltip>
          </AuthGate>
        </>
      }
    >
      <form onSubmit={form.onSubmit(async () => await handleSave())}>
        <Section>
          <div>
            <Text size="h2">{t('sections.config.title')}</Text>
            <Text size="h4">{t('sections.config.description')}</Text>
          </div>
          <SimpleGrid cols={1}>
            <TextInput label={t('form.name.label')} placeholder={t('form.name.placeholder')} {...form.getInputProps('name')} readOnly={isReadOnly} />
          </SimpleGrid>
          <SimpleGrid cols={3}>
            <TextInput label={t('form.code.label')} placeholder={t('form.code.placeholder')} {...form.getInputProps('code')} readOnly={isReadOnly} />
            <Select label={t('form.lang.label')} placeholder={t('form.lang.placeholder')} nothingFoundMessage={t('form.lang.nothingFound')} data={[{ value: 'pt', label: 'Português (Portugal)' }]} {...form.getInputProps('lang')} searchable readOnly={isReadOnly} />
            <Select label={t('form.timezone.label')} placeholder={t('form.timezone.placeholder')} nothingFoundMessage={t('form.timezone.nothingFound')} data={['Europe/Lisbon']} {...form.getInputProps('timezone')} searchable readOnly={isReadOnly} />
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
            <Text size="h2">{t('sections.operation.title')}</Text>
            <Text size="h4">{t('sections.operation.description')}</Text>
          </div>
          <SimpleGrid cols={2}>
            <DatePickerInput
              label={t('form.operation_start_date.label')}
              description={t('form.operation_start_date.description')}
              placeholder={t('form.operation_start_date.placeholder')}
              value={parseStringToDate(form.values.operation_start_date)}
              onChange={(date) => {
                console.log(date);
                form.setFieldValue('operation_start_date', parseDate(date));
              }}
              readOnly={isReadOnly}
              dropdownType="modal"
              clearable
            />
          </SimpleGrid>
        </Section>
        <Divider />
        <Section>
          <div>
            <Text size="h2">{t('sections.financials.title')}</Text>
            <Text size="h4">{t('sections.financials.description')}</Text>
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
              fixedDecimalScale
              decimalScale={2}
              thousandSeparator=" "
              decimalSeparator="."
              prefix={'€ '}
              readOnly={isReadOnly}
            />
            <NumberInput
              label={t('form.total_vkm_per_year.label')}
              description={t('form.total_vkm_per_year.description')}
              placeholder={t('form.total_vkm_per_year.placeholder')}
              {...form.getInputProps('total_vkm_per_year')}
              precision={0}
              min={0}
              step={1}
              fixedDecimalScale
              decimalScale={0}
              thousandSeparator=" "
              decimalSeparator="."
              suffix={' km'}
              readOnly={isReadOnly}
            />
          </SimpleGrid>
        </Section>
      </form>
    </Pannel>
  );
}
