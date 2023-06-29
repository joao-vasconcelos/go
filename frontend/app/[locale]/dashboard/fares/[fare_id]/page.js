'use client';

import useSWR from 'swr';
import { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next-intl/client';
import { useForm, yupResolver } from '@mantine/form';
import API from '@/services/API';
import { Validation as FareValidation } from '@/schemas/Fare/validation';
import { Default as FareDefault } from '@/schemas/Fare/default';
import { Tooltip, NumberInput, Select, SimpleGrid, TextInput, ActionIcon } from '@mantine/core';
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
  const t = useTranslations('fares');
  const [isSaving, setIsSaving] = useState(false);
  const [hasErrorSaving, setHasErrorSaving] = useState();
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: session } = useSession();
  const isReadOnly = !isAllowed(session, 'fares', 'create_edit');

  const { fare_id } = useParams();

  //
  // B. Fetch data

  const { mutate: allFaresMutate } = useSWR('/api/fares');
  const { data: fareData, error: fareError, isLoading: fareLoading } = useSWR(fare_id && `/api/fares/${fare_id}`, { onSuccess: (data) => keepFormUpdated(data) });

  //
  // C. Setup form

  const form = useForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    clearInputErrorOnChange: true,
    validate: yupResolver(FareValidation),
    initialValues: fareData || FareDefault,
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
    router.push(`/dashboard/fares/`);
  };

  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);
      await API({ service: 'fares', resourceId: fare_id, operation: 'edit', method: 'PUT', body: form.values });
      allFaresMutate();
      form.resetDirty();
      setIsSaving(false);
      setHasErrorSaving(false);
    } catch (err) {
      console.log(err);
      setIsSaving(false);
      setHasErrorSaving(err);
    }
  }, [fare_id, form, allFaresMutate]);

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
          notify(fare_id, 'loading', t('operations.delete.loading'));
          await API({ service: 'fares', resourceId: fare_id, operation: 'delete', method: 'DELETE' });
          allFaresMutate();
          router.push('/dashboard/fares');
          notify(fare_id, 'success', t('operations.delete.success'));
          setIsDeleting(false);
        } catch (err) {
          console.log(err);
          setIsDeleting(false);
          notify(fare_id, 'error', err.message || t('operations.delete.error'));
        }
      },
    });
  };

  //
  // E. Render components

  return (
    <Pannel
      loading={fareLoading || isDeleting}
      header={
        <>
          <AutoSave
            isValid={form.isValid()}
            isDirty={form.isDirty()}
            isLoading={fareLoading}
            isErrorValidating={fareError}
            isSaving={isSaving}
            isErrorSaving={hasErrorSaving}
            onValidate={() => handleValidate()}
            onSave={async () => await handleSave()}
            onClose={async () => await handleClose()}
          />
          <Text size='h1' style={!form.values.name && 'untitled'} full>
            {form.values.name || t('untitled')}
          </Text>
          <AuthGate scope='fares' permission='delete'>
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
          <SimpleGrid cols={3}>
            <TextInput label={t('form.name.label')} placeholder={t('form.name.placeholder')} {...form.getInputProps('name')} readOnly={isReadOnly} />
            <TextInput label={t('form.short_name.label')} placeholder={t('form.short_name.placeholder')} {...form.getInputProps('short_name')} readOnly={isReadOnly} />
            <TextInput label={t('form.code.label')} placeholder={t('form.code.placeholder')} {...form.getInputProps('code')} readOnly={isReadOnly} />
          </SimpleGrid>
          <SimpleGrid cols={2}>
            <NumberInput label={t('form.price.label')} placeholder={t('form.price.placeholder')} precision={2} step={0.05} min={0.0} {...form.getInputProps('price')} readOnly={isReadOnly} />
            <Select
              label={t('form.currency_type.label')}
              placeholder={t('form.currency_type.placeholder')}
              nothingFound={t('form.currency_type.nothingFound')}
              {...form.getInputProps('currency_type')}
              data={[{ value: 'EUR', label: t('form.currency_type.options.EUR') }]}
              readOnly={isReadOnly}
              searchable
            />
          </SimpleGrid>
          <SimpleGrid cols={2}>
            <Select
              label={t('form.payment_method.label')}
              placeholder={t('form.payment_method.placeholder')}
              nothingFound={t('form.payment_method.nothingFound')}
              {...form.getInputProps('payment_method')}
              data={[
                { value: '0', label: t('form.payment_method.options.0') },
                { value: '1', label: t('form.payment_method.options.1') },
              ]}
              readOnly={isReadOnly}
              searchable
            />
            <Select
              label={t('form.transfers.label')}
              placeholder={t('form.transfers.placeholder')}
              nothingFound={t('form.transfers.nothingFound')}
              {...form.getInputProps('transfers')}
              data={[
                { value: '0', label: t('form.transfers.options.0') },
                { value: '1', label: t('form.transfers.options.1') },
                { value: '2', label: t('form.transfers.options.2') },
                { value: 'unlimited', label: t('form.transfers.options.unlimited') },
              ]}
              readOnly={isReadOnly}
              searchable
            />
          </SimpleGrid>
        </Section>
      </form>
    </Pannel>
  );
}