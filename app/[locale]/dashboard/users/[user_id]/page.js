'use client';

import useSWR, { useSWRConfig } from 'swr';
import { useState, useCallback, useMemo } from 'react';
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
import UserActivityBadge from '../../../../../components/UserActivityBadge/UserActivityBadge';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import AuthGate, { isAllowed } from '../../../../../components/AuthGate/AuthGate';

export default function Page() {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const t = useTranslations('users');
  const { mutate } = useSWRConfig();
  const [isSaving, setIsSaving] = useState(false);
  const [hasErrorSaving, setHasErrorSaving] = useState();

  const { user_id } = useParams();

  const { data: session } = useSession();
  const isReadOnly = !isAllowed(session, 'users', 'create_edit');

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
  // D. Format data

  const agenciesFormattedForSelect = useMemo(() => {
    return agenciesData
      ? agenciesData.map((item) => {
          return { value: item._id, label: item.name || '-' };
        })
      : [];
  }, [agenciesData]);

  const municipalitiesFormattedForSelect = useMemo(() => {
    return municipalitiesData
      ? municipalitiesData.map((item) => {
          return { value: item._id, label: item.name || '-' };
        })
      : [];
  }, [municipalitiesData]);

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
      mutate(`/api/users/${user_id}`);
      form.resetDirty();
      setIsSaving(false);
      setHasErrorSaving(false);
    } catch (err) {
      console.log(err);
      setIsSaving(false);
      setHasErrorSaving(err);
    }
  }, [user_id, form, mutate]);

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
          <AuthGate scope='users' permission='delete'>
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
            <UserActivityBadge last_active={userData?.last_active} />
          </div>
          <SimpleGrid cols={1}>
            <TextInput label={t('form.name.label')} placeholder={t('form.name.placeholder')} {...form.getInputProps('name')} readOnly={isReadOnly} />
          </SimpleGrid>
          <SimpleGrid cols={2}>
            <TextInput label={t('form.email.label')} placeholder={t('form.email.placeholder')} {...form.getInputProps('email')} readOnly={isReadOnly} />
            <TextInput label={t('form.phone.label')} placeholder={t('form.phone.placeholder')} {...form.getInputProps('phone')} readOnly={isReadOnly} />
          </SimpleGrid>
        </Section>

        <Divider />

        <Section>
          <div>
            <Text size='h2'>{t('form.permissions.agencies.title')}</Text>
            <Text size='h4'>{t('form.permissions.agencies.description')}</Text>
          </div>
          <SimpleGrid cols={3} mt='md'>
            <Switch label={t('form.permissions.agencies.view.label')} description={t('form.permissions.agencies.view.description')} size='md' {...form.getInputProps('permissions.agencies.view', { type: 'checkbox' })} readOnly={isReadOnly} />
            <Switch
              size='md'
              label={t('form.permissions.agencies.create_edit.label')}
              description={t('form.permissions.agencies.create_edit.description')}
              {...form.getInputProps('permissions.agencies.create_edit', { type: 'checkbox' })}
              disabled={!form.values.permissions.agencies.view}
              readOnly={isReadOnly}
            />
            <Switch
              size='md'
              label={t('form.permissions.agencies.delete.label')}
              description={t('form.permissions.agencies.delete.description')}
              {...form.getInputProps('permissions.agencies.delete', { type: 'checkbox' })}
              disabled={!form.values.permissions.agencies.view}
              readOnly={isReadOnly}
            />
          </SimpleGrid>
        </Section>

        <Divider />

        <Section>
          <div>
            <Text size='h2'>{t('form.permissions.export.title')}</Text>
            <Text size='h4'>{t('form.permissions.export.description')}</Text>
          </div>
          <SimpleGrid cols={3} mt='md'>
            <Switch label={t('form.permissions.export.view.label')} description={t('form.permissions.export.view.description')} size='md' {...form.getInputProps('permissions.export.view', { type: 'checkbox' })} readOnly={isReadOnly} />
            <Switch
              size='md'
              label={t('form.permissions.export.gtfs_v18.label')}
              description={t('form.permissions.export.gtfs_v18.description')}
              {...form.getInputProps('permissions.export.gtfs_v18', { type: 'checkbox' })}
              disabled={!form.values.permissions.export.view}
              readOnly={isReadOnly}
            />
            <Switch
              size='md'
              label={t('form.permissions.export.gtfs_v29.label')}
              description={t('form.permissions.export.gtfs_v29.description')}
              {...form.getInputProps('permissions.export.gtfs_v29', { type: 'checkbox' })}
              disabled={!form.values.permissions.export.view}
              readOnly={isReadOnly}
            />
          </SimpleGrid>
          <SimpleGrid cols={1} mt='md'>
            <MultiSelect
              label={t('form.permissions.export.agencies.label')}
              placeholder={t('form.permissions.export.agencies.placeholder')}
              nothingFound={t('form.permissions.export.agencies.nothingFound')}
              {...form.getInputProps('permissions.export.agencies')}
              data={agenciesFormattedForSelect}
              disabled={!form.values.permissions.export.view}
              readOnly={isReadOnly}
              searchable
            />
          </SimpleGrid>
        </Section>

        <Divider />

        <Section>
          <div>
            <Text size='h2'>{t('form.permissions.users.title')}</Text>
            <Text size='h4'>{t('form.permissions.users.description')}</Text>
          </div>
          <SimpleGrid cols={4} mt='md'>
            <Switch label={t('form.permissions.users.view.label')} description={t('form.permissions.users.view.description')} size='md' {...form.getInputProps('permissions.users.view', { type: 'checkbox' })} />
            <Switch
              size='md'
              label={t('form.permissions.users.create_edit.label')}
              description={t('form.permissions.users.create_edit.description')}
              {...form.getInputProps('permissions.users.create_edit', { type: 'checkbox' })}
              disabled={!form.values.permissions.users.view}
              readOnly={isReadOnly}
            />
            <Switch
              size='md'
              label={t('form.permissions.users.delete.label')}
              description={t('form.permissions.users.delete.description')}
              {...form.getInputProps('permissions.users.delete', { type: 'checkbox' })}
              disabled={!form.values.permissions.users.view}
              readOnly={isReadOnly}
            />
            <Switch
              size='md'
              label={t('form.permissions.users.export.label')}
              description={t('form.permissions.users.export.description')}
              {...form.getInputProps('permissions.users.export', { type: 'checkbox' })}
              disabled={!form.values.permissions.users.view}
              readOnly={isReadOnly}
            />
          </SimpleGrid>
        </Section>

        <Divider />

        <Section>
          <div>
            <Text size='h2'>{t('form.permissions.lines.title')}</Text>
            <Text size='h4'>{t('form.permissions.lines.description')}</Text>
          </div>
          <SimpleGrid cols={3} mt='md'>
            <Switch label={t('form.permissions.lines.view.label')} description={t('form.permissions.lines.view.description')} size='md' {...form.getInputProps('permissions.lines.view', { type: 'checkbox' })} readOnly={isReadOnly} />
            <Switch
              size='md'
              label={t('form.permissions.lines.create_edit.label')}
              description={t('form.permissions.lines.create_edit.description')}
              {...form.getInputProps('permissions.lines.create_edit', { type: 'checkbox' })}
              disabled={!form.values.permissions.lines.view}
              readOnly={isReadOnly}
            />
            <Switch
              size='md'
              label={t('form.permissions.lines.delete.label')}
              description={t('form.permissions.lines.delete.description')}
              {...form.getInputProps('permissions.lines.delete', { type: 'checkbox' })}
              disabled={!form.values.permissions.lines.view}
              readOnly={isReadOnly}
            />
          </SimpleGrid>
          <SimpleGrid cols={1} mt='md'>
            <MultiSelect
              label={t('form.permissions.lines.agencies.label')}
              placeholder={t('form.permissions.lines.agencies.placeholder')}
              nothingFound={t('form.permissions.lines.agencies.nothingFound')}
              {...form.getInputProps('permissions.lines.agencies')}
              data={agenciesFormattedForSelect}
              disabled={!form.values.permissions.lines.view}
              readOnly={isReadOnly}
              searchable
            />
          </SimpleGrid>
        </Section>

        <Divider />

        <Section>
          <div>
            <Text size='h2'>{t('form.permissions.fares.title')}</Text>
            <Text size='h4'>{t('form.permissions.fares.description')}</Text>
          </div>
          <SimpleGrid cols={3} mt='md'>
            <Switch label={t('form.permissions.fares.view.label')} description={t('form.permissions.fares.view.description')} size='md' {...form.getInputProps('permissions.fares.view', { type: 'checkbox' })} readOnly={isReadOnly} />
            <Switch
              size='md'
              label={t('form.permissions.fares.create_edit.label')}
              description={t('form.permissions.fares.create_edit.description')}
              {...form.getInputProps('permissions.fares.create_edit', { type: 'checkbox' })}
              disabled={!form.values.permissions.fares.view}
              readOnly={isReadOnly}
            />
            <Switch
              size='md'
              label={t('form.permissions.fares.delete.label')}
              description={t('form.permissions.fares.delete.description')}
              {...form.getInputProps('permissions.fares.delete', { type: 'checkbox' })}
              disabled={!form.values.permissions.fares.view}
              readOnly={isReadOnly}
            />
          </SimpleGrid>
        </Section>

        <Divider />

        <Section>
          <div>
            <Text size='h2'>{t('form.permissions.stops.title')}</Text>
            <Text size='h4'>{t('form.permissions.stops.description')}</Text>
          </div>
          <SimpleGrid cols={3} mt='md'>
            <Switch label={t('form.permissions.stops.view.label')} description={t('form.permissions.stops.view.description')} size='md' {...form.getInputProps('permissions.stops.view', { type: 'checkbox' })} readOnly={isReadOnly} />
            <Switch
              size='md'
              label={t('form.permissions.stops.propose.label')}
              description={t('form.permissions.stops.propose.description')}
              {...form.getInputProps('permissions.stops.propose', { type: 'checkbox' })}
              disabled={!form.values.permissions.stops.view}
              readOnly={isReadOnly}
            />
            <Switch
              size='md'
              label={t('form.permissions.stops.create_edit.label')}
              description={t('form.permissions.stops.create_edit.description')}
              {...form.getInputProps('permissions.stops.create_edit', { type: 'checkbox' })}
              disabled={!form.values.permissions.stops.view}
              readOnly={isReadOnly}
            />
            <Switch
              size='md'
              label={t('form.permissions.stops.edit_code.label')}
              description={t('form.permissions.stops.edit_code.description')}
              {...form.getInputProps('permissions.stops.edit_code', { type: 'checkbox' })}
              disabled={!form.values.permissions.stops.view || !form.values.permissions.stops.create_edit}
              readOnly={isReadOnly}
            />
            <Switch
              size='md'
              label={t('form.permissions.stops.delete.label')}
              description={t('form.permissions.stops.delete.description')}
              {...form.getInputProps('permissions.stops.delete', { type: 'checkbox' })}
              disabled={!form.values.permissions.stops.view}
              readOnly={isReadOnly}
            />
          </SimpleGrid>
          <SimpleGrid cols={1} mt='md'>
            <MultiSelect
              label={t('form.permissions.stops.municipalities.label')}
              placeholder={t('form.permissions.stops.municipalities.placeholder')}
              nothingFound={t('form.permissions.stops.municipalities.nothingFound')}
              {...form.getInputProps('permissions.stops.municipalities')}
              data={municipalitiesFormattedForSelect}
              disabled={!form.values.permissions.stops.view}
              readOnly={isReadOnly}
              searchable
            />
          </SimpleGrid>
        </Section>

        <Divider />

        <Section>
          <Divider />
          <SimpleGrid cols={4}>
            <Switch label={t('form.permissions.alerts.view')} size='md' {...form.getInputProps('permissions.alerts_view', { type: 'checkbox' })} />
            <Switch label={t('form.permissions.alerts.edit')} size='md' {...form.getInputProps('permissions.alerts_edit', { type: 'checkbox' })} />
            <Switch label={t('form.permissions.alerts.create')} size='md' {...form.getInputProps('permissions.alerts_create', { type: 'checkbox' })} />
            <Switch label={t('form.permissions.alerts.delete')} size='md' {...form.getInputProps('permissions.alerts_delete', { type: 'checkbox' })} />
          </SimpleGrid>
          <Divider />
          <SimpleGrid cols={4}>
            <Switch label={t('form.permissions.calendars.view')} size='md' {...form.getInputProps('permissions.calendars_view', { type: 'checkbox' })} />
            <Switch label={t('form.permissions.calendars.edit')} size='md' {...form.getInputProps('permissions.calendars_edit', { type: 'checkbox' })} />
            <Switch label={t('form.permissions.calendars.create')} size='md' {...form.getInputProps('permissions.calendars_create', { type: 'checkbox' })} />
            <Switch label={t('form.permissions.calendars.delete')} size='md' {...form.getInputProps('permissions.calendars_delete', { type: 'checkbox' })} />
          </SimpleGrid>
          <Divider />
          <SimpleGrid cols={4}>
            <Switch label={t('form.permissions.dates.view')} size='md' {...form.getInputProps('permissions.dates_view', { type: 'checkbox' })} />
            <Switch label={t('form.permissions.dates.edit')} size='md' {...form.getInputProps('permissions.dates_edit', { type: 'checkbox' })} />
            <Switch label={t('form.permissions.dates.create')} size='md' {...form.getInputProps('permissions.dates_create', { type: 'checkbox' })} />
            <Switch label={t('form.permissions.dates.delete')} size='md' {...form.getInputProps('permissions.dates_delete', { type: 'checkbox' })} />
          </SimpleGrid>
          <Divider />
          <SimpleGrid cols={4}>
            <Switch label={t('form.permissions.municipalities.view')} size='md' {...form.getInputProps('permissions.municipalities_view', { type: 'checkbox' })} />
            <Switch label={t('form.permissions.municipalities.edit')} size='md' {...form.getInputProps('permissions.municipalities_edit', { type: 'checkbox' })} />
            <Switch label={t('form.permissions.municipalities.create')} size='md' {...form.getInputProps('permissions.municipalities_create', { type: 'checkbox' })} />
            <Switch label={t('form.permissions.municipalities.delete')} size='md' {...form.getInputProps('permissions.municipalities_delete', { type: 'checkbox' })} />
          </SimpleGrid>
          <Divider />
          <SimpleGrid cols={4}>
            <Switch label={t('form.permissions.shapes.view')} size='md' {...form.getInputProps('permissions.shapes_view', { type: 'checkbox' })} />
            <Switch label={t('form.permissions.shapes.edit')} size='md' {...form.getInputProps('permissions.shapes_edit', { type: 'checkbox' })} />
            <Switch label={t('form.permissions.shapes.create')} size='md' {...form.getInputProps('permissions.shapes_create', { type: 'checkbox' })} />
            <Switch label={t('form.permissions.shapes.delete')} size='md' {...form.getInputProps('permissions.shapes_delete', { type: 'checkbox' })} />
          </SimpleGrid>
          <Divider />
          <SimpleGrid cols={4}>
            <Switch label={t('form.permissions.threads.view')} size='md' {...form.getInputProps('permissions.threads_view', { type: 'checkbox' })} />
            <Switch label={t('form.permissions.threads.edit')} size='md' {...form.getInputProps('permissions.threads_edit', { type: 'checkbox' })} />
            <Switch label={t('form.permissions.threads.create')} size='md' {...form.getInputProps('permissions.threads_create', { type: 'checkbox' })} />
            <Switch label={t('form.permissions.threads.delete')} size='md' {...form.getInputProps('permissions.threads_delete', { type: 'checkbox' })} />
          </SimpleGrid>
        </Section>
      </form>
    </Pannel>
  );
}
