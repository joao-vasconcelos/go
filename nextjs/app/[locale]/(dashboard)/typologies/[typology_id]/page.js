'use client';

import useSWR from 'swr';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from '@/translations/navigation';
import { useForm, yupResolver } from '@mantine/form';
import API from '@/services/API';
import { TypologyValidation } from '@/schemas/Typology/validation';
import { TypologyDefault } from '@/schemas/Typology/default';
import { Tooltip, SimpleGrid, TextInput, ActionIcon, Divider, ColorInput } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import Pannel from '@/components/Pannel/Pannel';
import Text from '@/components/Text/Text';
import { Section } from '@/components/Layouts/Layouts';
import AutoSave from '@/components/AutoSave/AutoSave';
import notify from '@/services/notify';
import { openConfirmModal } from '@mantine/modals';
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
  const t = useTranslations('typologies');
  const [isSaving, setIsSaving] = useState(false);
  const [isLocking, setIsLocking] = useState(false);
  const [hasErrorSaving, setHasErrorSaving] = useState();
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: sessionData } = useSession();

  const { typology_id } = useParams();

  //
  // B. Fetch data

  const { mutate: allTypologiesMutate } = useSWR('/api/typologies');
  const { data: typologyData, error: typologyError, isLoading: typologyLoading, mutate: typologyMutate } = useSWR(typology_id && `/api/typologies/${typology_id}`, { onSuccess: (data) => keepFormUpdated(data) });

  //
  // C. Setup form

  const form = useForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    clearInputErrorOnChange: true,
    validate: yupResolver(TypologyValidation),
    initialValues: populate(TypologyDefault, typologyData),
  });

  const keepFormUpdated = (data) => {
    if (!form.isDirty()) {
      const populated = populate(TypologyDefault, data);
      form.setValues(populated);
      form.resetDirty(populated);
    }
  };

  //
  // D. Setup readonly

  const isReadOnly = !isAllowed(sessionData, [{ scope: 'typologies', action: 'edit' }], { handleError: true }) || typologyData?.is_locked;

  //
  // E. Handle actions

  const handleValidate = () => {
    const formattedJson = JSON.parse(form.values.geojson);
    form.setFieldValue('geojson', formattedJson);
    form.validate();
  };

  const handleClose = async () => {
    router.push(`/typologies/`);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await API({ service: 'typologies', resourceId: typology_id, operation: 'edit', method: 'PUT', body: form.values });
      typologyMutate();
      allTypologiesMutate();
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

  const handleLock = async () => {
    try {
      setIsLocking(true);
      await API({ service: 'typologies', resourceId: typology_id, operation: 'lock', method: 'PUT' });
      typologyMutate();
      setIsLocking(false);
    } catch (err) {
      console.log(err);
      typologyMutate();
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
          notify(typology_id, 'loading', t('operations.delete.loading'));
          await API({ service: 'typologies', resourceId: typology_id, operation: 'delete', method: 'DELETE' });
          allTypologiesMutate();
          router.push('/typologies');
          notify(typology_id, 'success', t('operations.delete.success'));
          setIsDeleting(false);
        } catch (err) {
          console.log(err);
          setIsDeleting(false);
          notify(typology_id, 'error', err.message || t('operations.delete.error'));
        }
      },
    });
  };

  //
  // E. Render components

  return (
    <Pannel
      loading={typologyLoading || isDeleting}
      header={
        <ListHeader>
          <AutoSave
            isValid={form.isValid()}
            isDirty={form.isDirty()}
            isLoading={typologyLoading}
            isErrorValidating={typologyError}
            isSaving={isSaving}
            isErrorSaving={hasErrorSaving}
            onValidate={() => handleValidate()}
            onSave={async () => await handleSave()}
            onClose={async () => await handleClose()}
          />
          <Text size="h1" style={!form.values.name && 'untitled'} full>
            {form.values.name || t('untitled')}
          </Text>
          <AppAuthenticationCheck permissions={[{ scope: 'typologies', action: 'lock' }]}>
            <LockButton isLocked={typologyData?.is_locked} onClick={handleLock} loading={isLocking} />
          </AppAuthenticationCheck>
          <AppAuthenticationCheck permissions={[{ scope: 'typologies', action: 'delete' }]}>
            <Tooltip label={t('operations.delete.title')} color="red" position="bottom" withArrow>
              <ActionIcon color="red" variant="light" size="lg" onClick={handleDelete}>
                <IconTrash size="20px" />
              </ActionIcon>
            </Tooltip>
          </AppAuthenticationCheck>
        </ListHeader>
      }
    >
      <form onSubmit={form.onSubmit(async () => await handleSave())}>
        <Section>
          <Text size="h2">{t('sections.config.title')}</Text>
          <SimpleGrid cols={2}>
            <TextInput label={t('form.code.label')} placeholder={t('form.code.placeholder')} {...form.getInputProps('code')} readOnly={isReadOnly} />
          </SimpleGrid>
          <SimpleGrid cols={2}>
            <TextInput label={t('form.name.label')} placeholder={t('form.name.placeholder')} {...form.getInputProps('name')} readOnly={isReadOnly} />
            <TextInput label={t('form.short_name.label')} placeholder={t('form.short_name.placeholder')} {...form.getInputProps('short_name')} readOnly={isReadOnly} />
          </SimpleGrid>
        </Section>

        <Divider />

        <Section>
          <Text size="h2">{t('sections.appearance.title')}</Text>
          <SimpleGrid cols={2}>
            <ColorInput label={t('form.color.label')} placeholder={t('form.color.placeholder')} {...form.getInputProps('color')} readOnly={isReadOnly} />
            <ColorInput label={t('form.text_color.label')} placeholder={t('form.text_color.placeholder')} {...form.getInputProps('text_color')} readOnly={isReadOnly} />
          </SimpleGrid>
        </Section>
      </form>
    </Pannel>
  );
}
