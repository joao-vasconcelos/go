'use client';

import useSWR from 'swr';
import { useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, yupResolver } from '@mantine/form';
import API from '../../../../../services/API';
import { Validation as UserValidation } from '../../../../../schemas/User/validation';
import { Default as UserDefault } from '../../../../../schemas/User/default';
import { Tooltip, SimpleGrid, TextInput, ActionIcon, Divider, Switch, MultiSelect } from '@mantine/core';
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
  const t = useTranslations('users');
  const [isSaving, setIsSaving] = useState(false);
  const [hasErrorSaving, setHasErrorSaving] = useState();

  const { user_id } = useParams();

  //
  // B. Fetch data

  const { data: userData, error: userError, isLoading: userLoading } = useSWR(user_id && `/api/users/${user_id}`, { onSuccess: (data) => keepFormUpdated(data) });
  const { data: agenciesData } = useSWR('/api/agencies');
  const { data: municipalitiesData } = useSWR('/api/municipalities');

  //
  // C. Setup form

  const form = useForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    clearInputErrorOnChange: true,
    validate: yupResolver(UserValidation),
    initialValues: userData || UserDefault,
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
    router.push(`/dashboard/users/`);
  };

  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);
      await API({ service: 'users', resourceId: user_id, operation: 'edit', method: 'PUT', body: form.values });
      form.resetDirty();
      setIsSaving(false);
      setHasErrorSaving(false);
    } catch (err) {
      console.log(err);
      setIsSaving(false);
      setHasErrorSaving(err);
    }
  }, [user_id, form]);

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
          notify(user_id, 'loading', t('operations.delete.loading'));
          await API({ service: 'users', resourceId: user_id, operation: 'delete', method: 'DELETE' });
          router.push('/dashboard/users');
          notify(user_id, 'success', t('operations.delete.success'));
        } catch (err) {
          console.log(err);
          notify(user_id, 'error', err.message || t('operations.delete.error'));
        }
      },
    });
  };

  //
  // E. Render components

  return (
    <Pannel
      loading={userLoading}
      header={
        <>
          <SaveButtons
            isValid={form.isValid()}
            isDirty={form.isDirty()}
            isLoading={userLoading}
            isErrorValidating={userError}
            isSaving={isSaving}
            isErrorSaving={hasErrorSaving}
            onValidate={() => handleValidate()}
            onSave={async () => await handleSave()}
            onClose={async () => await handleClose()}
          />
          <Text size='h1' style={!form.values.name && 'untitled'} full>
            {form.values.name || t('untitled')}
          </Text>
          <Tooltip label='Eliminar Utilizador' color='red' position='bottom' withArrow>
            <ActionIcon color='red' variant='light' size='lg' onClick={handleDelete}>
              <IconTrash size='20px' />
            </ActionIcon>
          </Tooltip>
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
            <TextInput label={t('form.name.label')} placeholder={t('form.name.placeholder')} {...form.getInputProps('name')} />
          </SimpleGrid>
          <SimpleGrid cols={2}>
            <TextInput label={t('form.email.label')} placeholder={t('form.email.placeholder')} {...form.getInputProps('email')} />
            <TextInput label={t('form.phone.label')} placeholder={t('form.phone.placeholder')} {...form.getInputProps('phone')} />
          </SimpleGrid>
          <SimpleGrid cols={2}>
            <TextInput label={t('form.emailVerified.label')} placeholder={t('form.emailVerified.placeholder')} {...form.getInputProps('emailVerified')} readOnly />
            <TextInput label={t('form.last_login.label')} placeholder={t('form.last_login.placeholder')} {...form.getInputProps('last_login')} readOnly />
          </SimpleGrid>
        </Section>
        <Divider />
        <Section>
          <div>
            <Text size='h2'>{t('sections.permissions.title')}</Text>
            <Text size='h4'>{t('sections.permissions.description')}</Text>
          </div>
          <SimpleGrid cols={2}>
            <MultiSelect
              label={t('form.agencies.label')}
              placeholder={t('form.agencies.placeholder')}
              nothingFound={t('form.agencies.nothingFound')}
              data={
                agenciesData
                  ? agenciesData.map((item) => {
                      return { value: item._id, label: item.agency_name || '-' };
                    })
                  : []
              }
              {...form.getInputProps('agencies')}
              searchable
            />
            <MultiSelect
              label={t('form.municipalities.label')}
              placeholder={t('form.municipalities.placeholder')}
              nothingFound={t('form.municipalities.nothingFound')}
              data={
                municipalitiesData
                  ? municipalitiesData.map((item) => {
                      return { value: item._id, label: item.name || '-' };
                    })
                  : []
              }
              {...form.getInputProps('municipalities')}
              searchable
            />
          </SimpleGrid>
        </Section>
        <Section>
          <SimpleGrid cols={4}>
            <Switch label={t('form.permissions.agencies.view')} size='md' {...form.getInputProps('permissions.agencies_view', { type: 'checkbox' })} />
            <Switch label={t('form.permissions.agencies.create')} size='md' {...form.getInputProps('permissions.agencies_create', { type: 'checkbox' })} />
            <Switch label={t('form.permissions.agencies.edit')} size='md' {...form.getInputProps('permissions.agencies_edit', { type: 'checkbox' })} />
            <Switch label={t('form.permissions.agencies.delete')} size='md' {...form.getInputProps('permissions.agencies_delete', { type: 'checkbox' })} />
          </SimpleGrid>
          <Divider />
          <SimpleGrid cols={4}>
            <Switch label={t('form.permissions.alerts.view')} size='md' {...form.getInputProps('permissions.alerts_view', { type: 'checkbox' })} />
            <Switch label={t('form.permissions.alerts.create')} size='md' {...form.getInputProps('permissions.alerts_create', { type: 'checkbox' })} />
            <Switch label={t('form.permissions.alerts.edit')} size='md' {...form.getInputProps('permissions.alerts_edit', { type: 'checkbox' })} />
            <Switch label={t('form.permissions.alerts.delete')} size='md' {...form.getInputProps('permissions.alerts_delete', { type: 'checkbox' })} />
          </SimpleGrid>
          <Divider />
          <SimpleGrid cols={4}>
            <Switch label={t('form.permissions.calendars.view')} size='md' {...form.getInputProps('permissions.calendars_view', { type: 'checkbox' })} />
            <Switch label={t('form.permissions.calendars.create')} size='md' {...form.getInputProps('permissions.calendars_create', { type: 'checkbox' })} />
            <Switch label={t('form.permissions.calendars.edit')} size='md' {...form.getInputProps('permissions.calendars_edit', { type: 'checkbox' })} />
            <Switch label={t('form.permissions.calendars.delete')} size='md' {...form.getInputProps('permissions.calendars_delete', { type: 'checkbox' })} />
          </SimpleGrid>
          <Divider />
          <SimpleGrid cols={4}>
            <Switch label={t('form.permissions.dates.view')} size='md' {...form.getInputProps('permissions.dates_view', { type: 'checkbox' })} />
            <Switch label={t('form.permissions.dates.create')} size='md' {...form.getInputProps('permissions.dates_create', { type: 'checkbox' })} />
            <Switch label={t('form.permissions.dates.edit')} size='md' {...form.getInputProps('permissions.dates_edit', { type: 'checkbox' })} />
            <Switch label={t('form.permissions.dates.delete')} size='md' {...form.getInputProps('permissions.dates_delete', { type: 'checkbox' })} />
          </SimpleGrid>
          <Divider />
          <SimpleGrid cols={4}>
            <Switch label={t('form.permissions.fares.view')} size='md' {...form.getInputProps('permissions.fares_view', { type: 'checkbox' })} />
            <Switch label={t('form.permissions.fares.create')} size='md' {...form.getInputProps('permissions.fares_create', { type: 'checkbox' })} />
            <Switch label={t('form.permissions.fares.edit')} size='md' {...form.getInputProps('permissions.fares_edit', { type: 'checkbox' })} />
            <Switch label={t('form.permissions.fares.delete')} size='md' {...form.getInputProps('permissions.fares_delete', { type: 'checkbox' })} />
          </SimpleGrid>
          <Divider />
          <SimpleGrid cols={4}>
            <Switch label={t('form.permissions.lines.view')} size='md' {...form.getInputProps('permissions.lines_view', { type: 'checkbox' })} />
            <Switch label={t('form.permissions.lines.create')} size='md' {...form.getInputProps('permissions.lines_create', { type: 'checkbox' })} />
            <Switch label={t('form.permissions.lines.edit')} size='md' {...form.getInputProps('permissions.lines_edit', { type: 'checkbox' })} />
            <Switch label={t('form.permissions.lines.delete')} size='md' {...form.getInputProps('permissions.lines_delete', { type: 'checkbox' })} />
          </SimpleGrid>
          <Divider />
          <SimpleGrid cols={4}>
            <Switch label={t('form.permissions.municipalities.view')} size='md' {...form.getInputProps('permissions.municipalities_view', { type: 'checkbox' })} />
            <Switch label={t('form.permissions.municipalities.create')} size='md' {...form.getInputProps('permissions.municipalities_create', { type: 'checkbox' })} />
            <Switch label={t('form.permissions.municipalities.edit')} size='md' {...form.getInputProps('permissions.municipalities_edit', { type: 'checkbox' })} />
            <Switch label={t('form.permissions.municipalities.delete')} size='md' {...form.getInputProps('permissions.municipalities_delete', { type: 'checkbox' })} />
          </SimpleGrid>
          <Divider />
          <SimpleGrid cols={4}>
            <Switch label={t('form.permissions.shapes.view')} size='md' {...form.getInputProps('permissions.shapes_view', { type: 'checkbox' })} />
            <Switch label={t('form.permissions.shapes.create')} size='md' {...form.getInputProps('permissions.shapes_create', { type: 'checkbox' })} />
            <Switch label={t('form.permissions.shapes.edit')} size='md' {...form.getInputProps('permissions.shapes_edit', { type: 'checkbox' })} />
            <Switch label={t('form.permissions.shapes.delete')} size='md' {...form.getInputProps('permissions.shapes_delete', { type: 'checkbox' })} />
          </SimpleGrid>
          <Divider />
          <SimpleGrid cols={4}>
            <Switch label={t('form.permissions.stops.view')} size='md' {...form.getInputProps('permissions.stops_view', { type: 'checkbox' })} />
            <Switch label={t('form.permissions.stops.create')} size='md' {...form.getInputProps('permissions.stops_create', { type: 'checkbox' })} />
            <Switch label={t('form.permissions.stops.edit')} size='md' {...form.getInputProps('permissions.stops_edit', { type: 'checkbox' })} />
            <Switch label={t('form.permissions.stops.delete')} size='md' {...form.getInputProps('permissions.stops_delete', { type: 'checkbox' })} />
          </SimpleGrid>
          <Divider />
          <SimpleGrid cols={4}>
            <Switch label={t('form.permissions.threads.view')} size='md' {...form.getInputProps('permissions.threads_view', { type: 'checkbox' })} />
            <Switch label={t('form.permissions.threads.create')} size='md' {...form.getInputProps('permissions.threads_create', { type: 'checkbox' })} />
            <Switch label={t('form.permissions.threads.edit')} size='md' {...form.getInputProps('permissions.threads_edit', { type: 'checkbox' })} />
            <Switch label={t('form.permissions.threads.delete')} size='md' {...form.getInputProps('permissions.threads_delete', { type: 'checkbox' })} />
          </SimpleGrid>
          <Divider />
          <SimpleGrid cols={4}>
            <Switch label={t('form.permissions.users.view')} size='md' {...form.getInputProps('permissions.users_view', { type: 'checkbox' })} />
            <Switch label={t('form.permissions.users.create')} size='md' {...form.getInputProps('permissions.users_create', { type: 'checkbox' })} />
            <Switch label={t('form.permissions.users.edit')} size='md' {...form.getInputProps('permissions.users_edit', { type: 'checkbox' })} />
            <Switch label={t('form.permissions.users.delete')} size='md' {...form.getInputProps('permissions.users_delete', { type: 'checkbox' })} />
          </SimpleGrid>
        </Section>
      </form>
    </Pannel>
  );
}
