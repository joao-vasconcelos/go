'use client';

/* * */

import { useTranslations } from 'next-intl';
import { useUsersExplorerContext } from '@/contexts/UsersExplorerContext';
import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import { SimpleGrid } from '@mantine/core';
import GlobalCheckboxCard from '@/components/GlobalCheckboxCard/GlobalCheckboxCard';

/* * */

export default function UsersExplorerIdPagePermissionsCalendars() {
  //

  //
  // A. Setup variables

  const t = useTranslations('UsersExplorerIdPagePermissionsCalendars');
  const usersExplorerContext = useUsersExplorerContext();

  //
  // B. Render components

  return (
    <AppLayoutSection>
      <SimpleGrid cols={3}>
        <GlobalCheckboxCard label={t('view.label')} description={t('view.description')} {...usersExplorerContext.form.getInputProps('permissions.calendars.view.is_allowed')} readOnly={usersExplorerContext.page.is_read_only} />
        <GlobalCheckboxCard
          label={t('edit.label')}
          description={t('edit.description')}
          {...usersExplorerContext.form.getInputProps('permissions.calendars.edit.is_allowed')}
          readOnly={usersExplorerContext.page.is_read_only}
          disabled={!usersExplorerContext.form.values.permissions.calendars.view.is_allowed}
        />
        <GlobalCheckboxCard
          label={t('lock.label')}
          description={t('lock.description')}
          {...usersExplorerContext.form.getInputProps('permissions.calendars.lock.is_allowed')}
          readOnly={usersExplorerContext.page.is_read_only}
          disabled={!usersExplorerContext.form.values.permissions.calendars.view.is_allowed}
        />
        <GlobalCheckboxCard
          label={t('create.label')}
          description={t('create.description')}
          {...usersExplorerContext.form.getInputProps('permissions.calendars.create.is_allowed')}
          readOnly={usersExplorerContext.page.is_read_only}
          disabled={!usersExplorerContext.form.values.permissions.calendars.view.is_allowed}
        />
        <GlobalCheckboxCard
          label={t('delete.label')}
          description={t('delete.description')}
          {...usersExplorerContext.form.getInputProps('permissions.calendars.delete.is_allowed')}
          readOnly={usersExplorerContext.page.is_read_only}
          disabled={!usersExplorerContext.form.values.permissions.calendars.view.is_allowed}
        />
        <GlobalCheckboxCard
          label={t('navigate.label')}
          description={t('navigate.description')}
          {...usersExplorerContext.form.getInputProps('permissions.calendars.navigate.is_allowed')}
          readOnly={usersExplorerContext.page.is_read_only}
          disabled={!usersExplorerContext.form.values.permissions.calendars.view.is_allowed}
        />
        <GlobalCheckboxCard
          label={t('edit_dates.label')}
          description={t('edit_dates.description')}
          {...usersExplorerContext.form.getInputProps('permissions.calendars.edit_dates.is_allowed')}
          readOnly={usersExplorerContext.page.is_read_only}
          disabled={!usersExplorerContext.form.values.permissions.calendars.view.is_allowed}
        />
        <GlobalCheckboxCard
          label={t('export_dates.label')}
          description={t('export_dates.description')}
          {...usersExplorerContext.form.getInputProps('permissions.calendars.export_dates.is_allowed')}
          readOnly={usersExplorerContext.page.is_read_only}
          disabled={!usersExplorerContext.form.values.permissions.calendars.view.is_allowed}
        />
      </SimpleGrid>
    </AppLayoutSection>
  );
}
