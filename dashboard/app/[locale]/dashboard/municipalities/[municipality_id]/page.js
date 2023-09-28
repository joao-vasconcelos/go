'use client';

import useSWR from 'swr';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next-intl/client';
import { useForm, yupResolver } from '@mantine/form';
import API from '@/services/API';
import { MunicipalityValidation } from '@/schemas/Municipality/validation';
import { MunicipalityDefault } from '@/schemas/Municipality/default';
import { MunicipalityOptions } from '@/schemas/Municipality/options';
import { Tooltip, SimpleGrid, TextInput, ActionIcon, Select } from '@mantine/core';
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

export default function Page() {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const t = useTranslations('municipalities');
  const [isSaving, setIsSaving] = useState(false);
  const [isLocking, setIsLocking] = useState(false);
  const [hasErrorSaving, setHasErrorSaving] = useState();
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: session } = useSession();

  const { municipality_id } = useParams();

  //
  // B. Fetch data

  const { mutate: allMunicipalitiesMutate } = useSWR('/api/municipalities');
  const { data: municipalityData, error: municipalityError, isLoading: municipalityLoading, mutate: municipalityMutate } = useSWR(municipality_id && `/api/municipalities/${municipality_id}`, { onSuccess: (data) => keepFormUpdated(data) });

  //
  // C. Setup form

  const form = useForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    clearInputErrorOnChange: true,
    validate: yupResolver(MunicipalityValidation),
    initialValues: populate(MunicipalityDefault, municipalityData),
  });

  const keepFormUpdated = (data) => {
    if (!form.isDirty()) {
      const populated = populate(MunicipalityDefault, data);
      form.setValues(populated);
      form.resetDirty(populated);
    }
  };

  //
  // D. Setup readonly

  const isReadOnly = !isAllowed(session, 'municipalities', 'create_edit') || municipalityData?.is_locked;

  //
  // E. Handle actions

  const handleValidate = () => {
    form.validate();
  };

  const handleClose = async () => {
    router.push(`/dashboard/municipalities/`);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await API({ service: 'municipalities', resourceId: municipality_id, operation: 'edit', method: 'PUT', body: form.values });
      municipalityMutate();
      allMunicipalitiesMutate();
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
      await API({ service: 'municipalities', resourceId: municipality_id, operation: 'lock', method: 'PUT', body: { is_locked: value } });
      municipalityMutate();
      setIsLocking(false);
    } catch (err) {
      console.log(err);
      municipalityMutate();
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
          notify(municipality_id, 'loading', t('operations.delete.loading'));
          await API({ service: 'municipalities', resourceId: municipality_id, operation: 'delete', method: 'DELETE' });
          allMunicipalitiesMutate();
          router.push('/dashboard/municipalities');
          notify(municipality_id, 'success', t('operations.delete.success'));
          setIsDeleting(false);
        } catch (err) {
          console.log(err);
          setIsDeleting(false);
          notify(municipality_id, 'error', err.message || t('operations.delete.error'));
        }
      },
    });
  };

  //
  // E. Render components

  return (
    <Pannel
      loading={municipalityLoading || isDeleting}
      header={
        <>
          <AutoSave
            isValid={form.isValid()}
            isDirty={form.isDirty()}
            isLoading={municipalityLoading}
            isErrorValidating={municipalityError}
            isSaving={isSaving}
            isErrorSaving={hasErrorSaving}
            onValidate={() => handleValidate()}
            onSave={async () => await handleSave()}
            onClose={async () => await handleClose()}
          />
          <Text size="h1" style={!form.values.name && 'untitled'} full>
            {form.values.name || t('untitled')}
          </Text>
          <AuthGate scope="municipalities" permission="lock">
            <LockButton isLocked={municipalityData?.is_locked} setLocked={handleLock} loading={isLocking} />
          </AuthGate>
          <AuthGate scope="municipalities" permission="delete">
            <Tooltip label={t('operations.delete.title')} color="red" position="bottom" withArrow>
              <ActionIcon color="red" variant="light" size="lg" onClick={handleDelete}>
                <IconTrash size="20px" />
              </ActionIcon>
            </Tooltip>
          </AuthGate>
        </>
      }
    >
      <form onSubmit={form.onSubmit(async () => await handleSave())}>
        <Section>
          <Text size="h2">{t('sections.config.title')}</Text>
          <SimpleGrid cols={2}>
            <TextInput label={t('form.code.label')} placeholder={t('form.code.placeholder')} {...form.getInputProps('code')} readOnly={isReadOnly} />
            <TextInput label={t('form.prefix.label')} placeholder={t('form.prefix.placeholder')} {...form.getInputProps('prefix')} readOnly={isReadOnly} />
          </SimpleGrid>
          <SimpleGrid cols={1}>
            <TextInput label={t('form.name.label')} placeholder={t('form.name.placeholder')} {...form.getInputProps('name')} readOnly={isReadOnly} />
          </SimpleGrid>
          <SimpleGrid cols={2}>
            <Select
              label={t('form.district.label')}
              placeholder={t('form.district.placeholder')}
              nothingFoundMessage={t('form.district.nothingFound')}
              {...form.getInputProps('district')}
              data={MunicipalityOptions.district}
              readOnly={isReadOnly}
              searchable
            />
            <Select label={t('form.region.label')} placeholder={t('form.region.placeholder')} nothingFoundMessage={t('form.region.nothingFound')} {...form.getInputProps('region')} data={MunicipalityOptions.region} readOnly={isReadOnly} searchable />
          </SimpleGrid>
        </Section>
      </form>
    </Pannel>
  );
}
