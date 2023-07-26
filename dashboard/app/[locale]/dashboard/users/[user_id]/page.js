'use client';

import useSWR from 'swr';
import { useState, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next-intl/client';
import { UserFormProvider, useUserForm } from '@/schemas/User/form';
import { yupResolver } from '@mantine/form';
import API from '@/services/API';
import { Validation as UserValidation } from '@/schemas/User/validation';
import { Default as UserDefault } from '@/schemas/User/default';
import { Tooltip, SimpleGrid, TextInput, ActionIcon, Divider, Switch, MultiSelect } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import Pannel from '@/components/Pannel/Pannel';
import Text from '@/components/Text/Text';
import { Section } from '@/components/Layouts/Layouts';
import AutoSave from '@/components/AutoSave/AutoSave';
import notify from '@/services/notify';
import { openConfirmModal } from '@mantine/modals';
import UserActivityBadge from '@/components/UserActivityBadge/UserActivityBadge';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import AuthGate, { isAllowed } from '@/components/AuthGate/AuthGate';
import populate from '@/services/populate';

export default function Page() {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const t = useTranslations('users');
  const [isSaving, setIsSaving] = useState(false);
  const [hasErrorSaving, setHasErrorSaving] = useState();
  const [isDeleting, setIsDeleting] = useState(false);

  const { user_id } = useParams();

  const { data: session } = useSession();
  const isReadOnly = !isAllowed(session, 'users', 'create_edit');

  //
  // B. Fetch data

  const { mutate: allUsersMutate } = useSWR('/api/users');
  const { data: userData, error: userError, isLoading: userLoading, mutate: userMutate } = useSWR(user_id && `/api/users/${user_id}`, { onSuccess: (data) => keepFormUpdated(data) });
  const { data: agenciesData } = useSWR('/api/agencies');
  const { data: municipalitiesData } = useSWR('/api/municipalities');

  //
  // C. Setup form

  const userForm = useUserForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    clearInputErrorOnChange: true,
    validate: yupResolver(UserValidation),
    initialValues: populate(UserDefault, userData),
  });

  const keepFormUpdated = (data) => {
    if (!userForm.isDirty()) {
      const populated = populate(UserDefault, data);
      userForm.setValues(populated);
      userForm.resetDirty(populated);
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
    userForm.validate();
  };

  const handleClose = async () => {
    router.push(`/dashboard/users/`);
  };

  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);
      await API({ service: 'users', resourceId: user_id, operation: 'edit', method: 'PUT', body: userForm.values });
      userMutate();
      allUsersMutate();
      userForm.resetDirty();
      setIsSaving(false);
      setHasErrorSaving(false);
    } catch (err) {
      console.log(err);
      setIsSaving(false);
      setHasErrorSaving(err);
    }
  }, [user_id, userForm, userMutate, allUsersMutate]);

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
          notify(user_id, 'loading', t('operations.delete.loading'));
          await API({ service: 'users', resourceId: user_id, operation: 'delete', method: 'DELETE' });
          allUsersMutate();
          router.push('/dashboard/users');
          notify(user_id, 'success', t('operations.delete.success'));
          setIsDeleting(false);
        } catch (err) {
          console.log(err);
          setIsDeleting(false);
          notify(user_id, 'error', err.message || t('operations.delete.error'));
        }
      },
    });
  };

  //
  // E. Render components

  return (
    <Pannel
      loading={userLoading || isDeleting}
      header={
        <>
          <AutoSave
            isValid={userForm.isValid()}
            isDirty={userForm.isDirty()}
            isLoading={userLoading}
            isErrorValidating={userError}
            isSaving={isSaving}
            isErrorSaving={hasErrorSaving}
            onValidate={handleValidate}
            onSave={handleSave}
            onClose={handleClose}
          />
          <Text size='h1' style={!userForm.values.name && 'untitled'} full>
            {userForm.values.name || t('untitled')}
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
      <UserFormProvider form={userForm}>
        <form onSubmit={userForm.onSubmit(async () => await handleSave())}>
          <Section>
            <div>
              <Text size='h2'>{t('sections.config.title')}</Text>
              <Text size='h4'>{t('sections.config.description')}</Text>
              <UserActivityBadge last_active={userData?.last_active} />
            </div>
            <SimpleGrid cols={1}>
              <TextInput label={t('form.name.label')} placeholder={t('form.name.placeholder')} {...userForm.getInputProps('name')} readOnly={isReadOnly} />
            </SimpleGrid>
            <SimpleGrid cols={2}>
              <TextInput label={t('form.email.label')} placeholder={t('form.email.placeholder')} {...userForm.getInputProps('email')} readOnly={isReadOnly} />
              <TextInput label={t('form.phone.label')} placeholder={t('form.phone.placeholder')} {...userForm.getInputProps('phone')} readOnly={isReadOnly} />
            </SimpleGrid>
          </Section>

          <Divider />

          <Section>
            <div>
              <Text size='h2'>{t('form.permissions.agencies.title')}</Text>
              <Text size='h4'>{t('form.permissions.agencies.description')}</Text>
            </div>
            <SimpleGrid cols={3} mt='md'>
              <Switch label={t('form.permissions.agencies.view.label')} description={t('form.permissions.agencies.view.description')} size='md' {...userForm.getInputProps('permissions.agencies.view', { type: 'checkbox' })} readOnly={isReadOnly} />
              <Switch
                size='md'
                label={t('form.permissions.agencies.create_edit.label')}
                description={t('form.permissions.agencies.create_edit.description')}
                {...userForm.getInputProps('permissions.agencies.create_edit', { type: 'checkbox' })}
                disabled={!userForm.values.permissions.agencies.view}
                readOnly={isReadOnly}
              />
              <Switch
                size='md'
                label={t('form.permissions.agencies.delete.label')}
                description={t('form.permissions.agencies.delete.description')}
                {...userForm.getInputProps('permissions.agencies.delete', { type: 'checkbox' })}
                disabled={!userForm.values.permissions.agencies.view}
                readOnly={isReadOnly}
              />
            </SimpleGrid>
          </Section>

          <Divider />

          <Section>
            <div>
              <Text size='h2'>{t('form.permissions.exports.title')}</Text>
              <Text size='h4'>{t('form.permissions.exports.description')}</Text>
            </div>
            <SimpleGrid cols={1} mt='md'>
              <Switch label={t('form.permissions.exports.view.label')} description={t('form.permissions.exports.view.description')} size='md' {...userForm.getInputProps('permissions.exports.view', { type: 'checkbox' })} readOnly={isReadOnly} />
            </SimpleGrid>
            <SimpleGrid cols={3} mt='md'>
              <Switch
                size='md'
                label={t('form.permissions.exports.gtfs_v18.label')}
                description={t('form.permissions.exports.gtfs_v18.description')}
                {...userForm.getInputProps('permissions.exports.gtfs_v18', { type: 'checkbox' })}
                disabled={!userForm.values.permissions.exports.view}
                readOnly={isReadOnly}
              />
              <Switch
                size='md'
                label={t('form.permissions.exports.gtfs_v29.label')}
                description={t('form.permissions.exports.gtfs_v29.description')}
                {...userForm.getInputProps('permissions.exports.gtfs_v29', { type: 'checkbox' })}
                disabled={!userForm.values.permissions.exports.view}
                readOnly={isReadOnly}
              />
              <Switch
                size='md'
                label={t('form.permissions.exports.gtfs_v30.label')}
                description={t('form.permissions.exports.gtfs_v30.description')}
                {...userForm.getInputProps('permissions.exports.gtfs_v30', { type: 'checkbox' })}
                disabled={!userForm.values.permissions.exports.view}
                readOnly={isReadOnly}
              />
              <Switch
                size='md'
                label={t('form.permissions.exports.netex_v1.label')}
                description={t('form.permissions.exports.netex_v1.description')}
                {...userForm.getInputProps('permissions.exports.netex_v1', { type: 'checkbox' })}
                disabled={!userForm.values.permissions.exports.view}
                readOnly={isReadOnly}
              />
            </SimpleGrid>
            <SimpleGrid cols={1} mt='md'>
              <MultiSelect
                label={t('form.permissions.exports.agencies.label')}
                placeholder={t('form.permissions.exports.agencies.placeholder')}
                nothingFound={t('form.permissions.exports.agencies.nothingFound')}
                {...userForm.getInputProps('permissions.exports.agencies')}
                data={agenciesFormattedForSelect}
                disabled={!userForm.values.permissions.exports.view}
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
            <SimpleGrid cols={3} mt='md'>
              <Switch label={t('form.permissions.users.view.label')} description={t('form.permissions.users.view.description')} size='md' {...userForm.getInputProps('permissions.users.view', { type: 'checkbox' })} />
              <Switch
                size='md'
                label={t('form.permissions.users.create_edit.label')}
                description={t('form.permissions.users.create_edit.description')}
                {...userForm.getInputProps('permissions.users.create_edit', { type: 'checkbox' })}
                disabled={!userForm.values.permissions.users.view}
                readOnly={isReadOnly}
              />
              <Switch
                size='md'
                label={t('form.permissions.users.delete.label')}
                description={t('form.permissions.users.delete.description')}
                {...userForm.getInputProps('permissions.users.delete', { type: 'checkbox' })}
                disabled={!userForm.values.permissions.users.view}
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
              <Switch label={t('form.permissions.lines.view.label')} description={t('form.permissions.lines.view.description')} size='md' {...userForm.getInputProps('permissions.lines.view', { type: 'checkbox' })} readOnly={isReadOnly} />
              <Switch
                size='md'
                label={t('form.permissions.lines.create_edit.label')}
                description={t('form.permissions.lines.create_edit.description')}
                {...userForm.getInputProps('permissions.lines.create_edit', { type: 'checkbox' })}
                disabled={!userForm.values.permissions.lines.view}
                readOnly={isReadOnly}
              />
              <Switch
                size='md'
                label={t('form.permissions.lines.delete.label')}
                description={t('form.permissions.lines.delete.description')}
                {...userForm.getInputProps('permissions.lines.delete', { type: 'checkbox' })}
                disabled={!userForm.values.permissions.lines.view}
                readOnly={isReadOnly}
              />
            </SimpleGrid>
            <SimpleGrid cols={1} mt='md'>
              <MultiSelect
                label={t('form.permissions.lines.agencies.label')}
                placeholder={t('form.permissions.lines.agencies.placeholder')}
                nothingFound={t('form.permissions.lines.agencies.nothingFound')}
                {...userForm.getInputProps('permissions.lines.agencies')}
                data={agenciesFormattedForSelect}
                disabled={!userForm.values.permissions.lines.view}
                readOnly={isReadOnly}
                searchable
              />
            </SimpleGrid>
          </Section>

          <Divider />

          <Section>
            <div>
              <Text size='h2'>{t('form.permissions.typologies.title')}</Text>
              <Text size='h4'>{t('form.permissions.typologies.description')}</Text>
            </div>
            <SimpleGrid cols={3} mt='md'>
              <Switch
                label={t('form.permissions.typologies.view.label')}
                description={t('form.permissions.typologies.view.description')}
                size='md'
                {...userForm.getInputProps('permissions.typologies.view', { type: 'checkbox' })}
                readOnly={isReadOnly}
              />
              <Switch
                size='md'
                label={t('form.permissions.typologies.create_edit.label')}
                description={t('form.permissions.typologies.create_edit.description')}
                {...userForm.getInputProps('permissions.typologies.create_edit', { type: 'checkbox' })}
                disabled={!userForm.values.permissions.typologies.view}
                readOnly={isReadOnly}
              />
              <Switch
                size='md'
                label={t('form.permissions.typologies.delete.label')}
                description={t('form.permissions.typologies.delete.description')}
                {...userForm.getInputProps('permissions.typologies.delete', { type: 'checkbox' })}
                disabled={!userForm.values.permissions.typologies.view}
                readOnly={isReadOnly}
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
              <Switch label={t('form.permissions.fares.view.label')} description={t('form.permissions.fares.view.description')} size='md' {...userForm.getInputProps('permissions.fares.view', { type: 'checkbox' })} readOnly={isReadOnly} />
              <Switch
                size='md'
                label={t('form.permissions.fares.create_edit.label')}
                description={t('form.permissions.fares.create_edit.description')}
                {...userForm.getInputProps('permissions.fares.create_edit', { type: 'checkbox' })}
                disabled={!userForm.values.permissions.fares.view}
                readOnly={isReadOnly}
              />
              <Switch
                size='md'
                label={t('form.permissions.fares.delete.label')}
                description={t('form.permissions.fares.delete.description')}
                {...userForm.getInputProps('permissions.fares.delete', { type: 'checkbox' })}
                disabled={!userForm.values.permissions.fares.view}
                readOnly={isReadOnly}
              />
            </SimpleGrid>
          </Section>

          <Divider />

          <Section>
            <div>
              <Text size='h2'>{t('form.permissions.zones.title')}</Text>
              <Text size='h4'>{t('form.permissions.zones.description')}</Text>
            </div>
            <SimpleGrid cols={3} mt='md'>
              <Switch label={t('form.permissions.zones.view.label')} description={t('form.permissions.zones.view.description')} size='md' {...userForm.getInputProps('permissions.zones.view', { type: 'checkbox' })} readOnly={isReadOnly} />
              <Switch
                size='md'
                label={t('form.permissions.zones.create_edit.label')}
                description={t('form.permissions.zones.create_edit.description')}
                {...userForm.getInputProps('permissions.zones.create_edit', { type: 'checkbox' })}
                disabled={!userForm.values.permissions.zones.view}
                readOnly={isReadOnly}
              />
              <Switch
                size='md'
                label={t('form.permissions.zones.delete.label')}
                description={t('form.permissions.zones.delete.description')}
                {...userForm.getInputProps('permissions.zones.delete', { type: 'checkbox' })}
                disabled={!userForm.values.permissions.zones.view}
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
              <Switch label={t('form.permissions.stops.view.label')} description={t('form.permissions.stops.view.description')} size='md' {...userForm.getInputProps('permissions.stops.view', { type: 'checkbox' })} readOnly={isReadOnly} />
              <Switch
                size='md'
                label={t('form.permissions.stops.propose.label')}
                description={t('form.permissions.stops.propose.description')}
                {...userForm.getInputProps('permissions.stops.propose', { type: 'checkbox' })}
                disabled={!userForm.values.permissions.stops.view}
                readOnly={isReadOnly}
              />
              <Switch
                size='md'
                label={t('form.permissions.stops.create_edit.label')}
                description={t('form.permissions.stops.create_edit.description')}
                {...userForm.getInputProps('permissions.stops.create_edit', { type: 'checkbox' })}
                disabled={!userForm.values.permissions.stops.view}
                readOnly={isReadOnly}
              />
              <Switch
                size='md'
                label={t('form.permissions.stops.edit_code.label')}
                description={t('form.permissions.stops.edit_code.description')}
                {...userForm.getInputProps('permissions.stops.edit_code', { type: 'checkbox' })}
                disabled={!userForm.values.permissions.stops.view || !userForm.values.permissions.stops.create_edit}
                readOnly={isReadOnly}
              />
              <Switch
                size='md'
                label={t('form.permissions.stops.delete.label')}
                description={t('form.permissions.stops.delete.description')}
                {...userForm.getInputProps('permissions.stops.delete', { type: 'checkbox' })}
                disabled={!userForm.values.permissions.stops.view}
                readOnly={isReadOnly}
              />
            </SimpleGrid>
            <SimpleGrid cols={1} mt='md'>
              <MultiSelect
                label={t('form.permissions.stops.municipalities.label')}
                placeholder={t('form.permissions.stops.municipalities.placeholder')}
                nothingFound={t('form.permissions.stops.municipalities.nothingFound')}
                {...userForm.getInputProps('permissions.stops.municipalities')}
                data={municipalitiesFormattedForSelect}
                disabled={!userForm.values.permissions.stops.view}
                readOnly={isReadOnly}
                searchable
              />
            </SimpleGrid>
          </Section>

          <Divider />

          <Section>
            <div>
              <Text size='h2'>{t('form.permissions.municipalities.title')}</Text>
              <Text size='h4'>{t('form.permissions.municipalities.description')}</Text>
            </div>
            <SimpleGrid cols={3} mt='md'>
              <Switch
                label={t('form.permissions.municipalities.view.label')}
                description={t('form.permissions.municipalities.view.description')}
                size='md'
                {...userForm.getInputProps('permissions.municipalities.view', { type: 'checkbox' })}
                readOnly={isReadOnly}
              />
              <Switch
                size='md'
                label={t('form.permissions.municipalities.create_edit.label')}
                description={t('form.permissions.municipalities.create_edit.description')}
                {...userForm.getInputProps('permissions.municipalities.create_edit', { type: 'checkbox' })}
                disabled={!userForm.values.permissions.municipalities.view}
                readOnly={isReadOnly}
              />
              <Switch
                size='md'
                label={t('form.permissions.municipalities.delete.label')}
                description={t('form.permissions.municipalities.delete.description')}
                {...userForm.getInputProps('permissions.municipalities.delete', { type: 'checkbox' })}
                disabled={!userForm.values.permissions.municipalities.view}
                readOnly={isReadOnly}
              />
            </SimpleGrid>
          </Section>

          <Divider />

          <Section>
            <div>
              <Text size='h2'>{t('form.permissions.alerts.title')}</Text>
              <Text size='h4'>{t('form.permissions.alerts.description')}</Text>
            </div>
            <SimpleGrid cols={4} mt='md'>
              <Switch label={t('form.permissions.alerts.view.label')} description={t('form.permissions.alerts.view.description')} size='md' {...userForm.getInputProps('permissions.alerts.view', { type: 'checkbox' })} readOnly={isReadOnly} />
              <Switch
                size='md'
                label={t('form.permissions.alerts.create_edit.label')}
                description={t('form.permissions.alerts.create_edit.description')}
                {...userForm.getInputProps('permissions.alerts.create_edit', { type: 'checkbox' })}
                disabled={!userForm.values.permissions.alerts.view}
                readOnly={isReadOnly}
              />
              <Switch
                size='md'
                label={t('form.permissions.alerts.publish.label')}
                description={t('form.permissions.alerts.publish.description')}
                {...userForm.getInputProps('permissions.alerts.publish', { type: 'checkbox' })}
                disabled={!userForm.values.permissions.alerts.view}
                readOnly={isReadOnly}
              />
              <Switch
                size='md'
                label={t('form.permissions.alerts.delete.label')}
                description={t('form.permissions.alerts.delete.description')}
                {...userForm.getInputProps('permissions.alerts.delete', { type: 'checkbox' })}
                disabled={!userForm.values.permissions.alerts.view}
                readOnly={isReadOnly}
              />
            </SimpleGrid>
          </Section>

          <Divider />

          <Section>
            <div>
              <Text size='h2'>{t('form.permissions.calendars.title')}</Text>
              <Text size='h4'>{t('form.permissions.calendars.description')}</Text>
            </div>
            <SimpleGrid cols={3} mt='md'>
              <Switch label={t('form.permissions.calendars.view.label')} description={t('form.permissions.calendars.view.description')} size='md' {...userForm.getInputProps('permissions.calendars.view', { type: 'checkbox' })} readOnly={isReadOnly} />
              <Switch
                size='md'
                label={t('form.permissions.calendars.create_edit.label')}
                description={t('form.permissions.calendars.create_edit.description')}
                {...userForm.getInputProps('permissions.calendars.create_edit', { type: 'checkbox' })}
                disabled={!userForm.values.permissions.calendars.view}
                readOnly={isReadOnly}
              />
              <Switch
                size='md'
                label={t('form.permissions.calendars.delete.label')}
                description={t('form.permissions.calendars.delete.description')}
                {...userForm.getInputProps('permissions.calendars.delete', { type: 'checkbox' })}
                disabled={!userForm.values.permissions.calendars.view}
                readOnly={isReadOnly}
              />
            </SimpleGrid>
          </Section>

          <Divider />

          <Section>
            <div>
              <Text size='h2'>{t('form.permissions.dates.title')}</Text>
              <Text size='h4'>{t('form.permissions.dates.description')}</Text>
            </div>
            <SimpleGrid cols={3} mt='md'>
              <Switch label={t('form.permissions.dates.view.label')} description={t('form.permissions.dates.view.description')} size='md' {...userForm.getInputProps('permissions.dates.view', { type: 'checkbox' })} readOnly={isReadOnly} />
              <Switch
                size='md'
                label={t('form.permissions.dates.create_edit.label')}
                description={t('form.permissions.dates.create_edit.description')}
                {...userForm.getInputProps('permissions.dates.create_edit', { type: 'checkbox' })}
                disabled={!userForm.values.permissions.dates.view}
                readOnly={isReadOnly}
              />
              <Switch
                size='md'
                label={t('form.permissions.dates.delete.label')}
                description={t('form.permissions.dates.delete.description')}
                {...userForm.getInputProps('permissions.dates.delete', { type: 'checkbox' })}
                disabled={!userForm.values.permissions.dates.view}
                readOnly={isReadOnly}
              />
            </SimpleGrid>
          </Section>

          <Divider />

          <Section>
            <div>
              <Text size='h2'>{t('form.permissions.threads.title')}</Text>
              <Text size='h4'>{t('form.permissions.threads.description')}</Text>
            </div>
            <SimpleGrid cols={3} mt='md'>
              <Switch label={t('form.permissions.threads.view.label')} description={t('form.permissions.threads.view.description')} size='md' {...userForm.getInputProps('permissions.threads.view', { type: 'checkbox' })} readOnly={isReadOnly} />
              <Switch
                size='md'
                label={t('form.permissions.threads.create_edit.label')}
                description={t('form.permissions.threads.create_edit.description')}
                {...userForm.getInputProps('permissions.threads.create_edit', { type: 'checkbox' })}
                disabled={!userForm.values.permissions.threads.view}
                readOnly={isReadOnly}
              />
              <Switch
                size='md'
                label={t('form.permissions.threads.delete.label')}
                description={t('form.permissions.threads.delete.description')}
                {...userForm.getInputProps('permissions.threads.delete', { type: 'checkbox' })}
                disabled={!userForm.values.permissions.threads.view}
                readOnly={isReadOnly}
              />
            </SimpleGrid>
          </Section>

          <Divider />

          <Section>
            <div>
              <Text size='h2'>{t('form.permissions.configs.title')}</Text>
              <Text size='h4'>{t('form.permissions.configs.description')}</Text>
            </div>
            <SimpleGrid cols={3} mt='md'>
              <Switch label={t('form.permissions.configs.admin.label')} description={t('form.permissions.configs.admin.description')} size='md' {...userForm.getInputProps('permissions.configs.admin', { type: 'checkbox' })} readOnly={isReadOnly} />
            </SimpleGrid>
          </Section>
        </form>
      </UserFormProvider>
    </Pannel>
  );
}
