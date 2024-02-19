'use client';

/* * */

import { useTranslations } from 'next-intl';
import { useUsersExplorerContext } from '@/contexts/UsersExplorerContext';
import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import GlobalCheckboxCard from '@/components/GlobalCheckboxCard/GlobalCheckboxCard';

/* * */

export default function UsersExplorerIdPagePermissionsReporting() {
  //

  //
  // A. Setup variables

  const t = useTranslations('UsersExplorerIdPagePermissionsReporting');
  const usersExplorerContext = useUsersExplorerContext();

  //
  // B. Render components

  return (
    <AppLayoutSection>
      <GlobalCheckboxCard label={t('view.label')} description={t('view.description')} {...usersExplorerContext.form.getInputProps('permissions.reporting.view.is_allowed')} readOnly={usersExplorerContext.page.is_read_only} />
      <GlobalCheckboxCard
        label={t('edit.label')}
        description={t('edit.description')}
        {...usersExplorerContext.form.getInputProps('permissions.reporting.edit.is_allowed')}
        readOnly={usersExplorerContext.page.is_read_only}
        disabled={!usersExplorerContext.form.values.permissions.reporting.view.is_allowed}
      />
      <GlobalCheckboxCard
        label={t('lock.label')}
        description={t('lock.description')}
        {...usersExplorerContext.form.getInputProps('permissions.reporting.lock.is_allowed')}
        readOnly={usersExplorerContext.page.is_read_only}
        disabled={!usersExplorerContext.form.values.permissions.reporting.view.is_allowed}
      />
      <GlobalCheckboxCard
        label={t('create.label')}
        description={t('create.description')}
        {...usersExplorerContext.form.getInputProps('permissions.reporting.create.is_allowed')}
        readOnly={usersExplorerContext.page.is_read_only}
        disabled={!usersExplorerContext.form.values.permissions.reporting.view.is_allowed}
      />
      <GlobalCheckboxCard
        label={t('delete.label')}
        description={t('delete.description')}
        {...usersExplorerContext.form.getInputProps('permissions.reporting.delete.is_allowed')}
        readOnly={usersExplorerContext.page.is_read_only}
        disabled={!usersExplorerContext.form.values.permissions.reporting.view.is_allowed}
      />
      <GlobalCheckboxCard
        label={t('navigate.label')}
        description={t('navigate.description')}
        {...usersExplorerContext.form.getInputProps('permissions.reporting.navigate.is_allowed')}
        readOnly={usersExplorerContext.page.is_read_only}
        disabled={!usersExplorerContext.form.values.permissions.reporting.view.is_allowed}
      />
    </AppLayoutSection>
  );
}
