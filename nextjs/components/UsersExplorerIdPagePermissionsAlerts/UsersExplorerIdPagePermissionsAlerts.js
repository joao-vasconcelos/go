'use client';

/* * */

import { useTranslations } from 'next-intl';
import { useUsersExplorerContext } from '@/contexts/UsersExplorerContext';
import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import { SimpleGrid } from '@mantine/core';
import GlobalCheckboxCard from '@/components/GlobalCheckboxCard/GlobalCheckboxCard';

/* * */

export default function UsersExplorerIdPagePermissionsAlerts() {
  //

  //
  // A. Setup variables

  const t = useTranslations('UsersExplorerIdPagePermissionsAlerts');
  const usersExplorerContext = useUsersExplorerContext();

  //
  // B. Render components

  return (
    <AppLayoutSection>
      <SimpleGrid cols={3}>
        <GlobalCheckboxCard label={t('view.label')} description={t('view.description')} {...usersExplorerContext.form.getInputProps('permissions.alerts.view.is_allowed')} readOnly={usersExplorerContext.page.is_read_only} />
        <GlobalCheckboxCard
          label={t('edit.label')}
          description={t('edit.description')}
          {...usersExplorerContext.form.getInputProps('permissions.alerts.edit.is_allowed')}
          readOnly={usersExplorerContext.page.is_read_only}
          disabled={!usersExplorerContext.form.values.permissions.alerts.view.is_allowed}
        />
        <GlobalCheckboxCard
          label={t('lock.label')}
          description={t('lock.description')}
          {...usersExplorerContext.form.getInputProps('permissions.alerts.lock.is_allowed')}
          readOnly={usersExplorerContext.page.is_read_only}
          disabled={!usersExplorerContext.form.values.permissions.alerts.view.is_allowed}
        />
        <GlobalCheckboxCard
          label={t('create.label')}
          description={t('create.description')}
          {...usersExplorerContext.form.getInputProps('permissions.alerts.create.is_allowed')}
          readOnly={usersExplorerContext.page.is_read_only}
          disabled={!usersExplorerContext.form.values.permissions.alerts.view.is_allowed}
        />
        <GlobalCheckboxCard
          label={t('delete.label')}
          description={t('delete.description')}
          {...usersExplorerContext.form.getInputProps('permissions.alerts.delete.is_allowed')}
          readOnly={usersExplorerContext.page.is_read_only}
          disabled={!usersExplorerContext.form.values.permissions.alerts.view.is_allowed}
        />
        <GlobalCheckboxCard
          label={t('navigate.label')}
          description={t('navigate.description')}
          {...usersExplorerContext.form.getInputProps('permissions.alerts.navigate.is_allowed')}
          readOnly={usersExplorerContext.page.is_read_only}
          disabled={!usersExplorerContext.form.values.permissions.alerts.view.is_allowed}
        />
      </SimpleGrid>
    </AppLayoutSection>
  );
}
