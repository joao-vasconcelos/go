'use client';

/* * */

import { useTranslations } from 'next-intl';
import { useUsersExplorerContext } from '@/contexts/UsersExplorerContext';
import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import GlobalCheckboxCard from '@/components/GlobalCheckboxCard/GlobalCheckboxCard';

/* * */

export default function UsersExplorerIdPagePermissionsTags() {
  //

  //
  // A. Setup variables

  const t = useTranslations('UsersExplorerIdPagePermissionsTags');
  const usersExplorerContext = useUsersExplorerContext();

  //
  // B. Render components

  return (
    <AppLayoutSection>
      <GlobalCheckboxCard label={t('view.label')} description={t('view.description')} {...usersExplorerContext.form.getInputProps('permissions.tags.view.is_allowed')} readOnly={usersExplorerContext.page.is_read_only} />
      <GlobalCheckboxCard label={t('edit.label')} description={t('edit.description')} {...usersExplorerContext.form.getInputProps('permissions.tags.edit.is_allowed')} readOnly={usersExplorerContext.page.is_read_only} disabled={!usersExplorerContext.form.values.permissions.tags.view.is_allowed} />
      <GlobalCheckboxCard label={t('lock.label')} description={t('lock.description')} {...usersExplorerContext.form.getInputProps('permissions.tags.lock.is_allowed')} readOnly={usersExplorerContext.page.is_read_only} disabled={!usersExplorerContext.form.values.permissions.tags.view.is_allowed} />
      <GlobalCheckboxCard
        label={t('create.label')}
        description={t('create.description')}
        {...usersExplorerContext.form.getInputProps('permissions.tags.create.is_allowed')}
        readOnly={usersExplorerContext.page.is_read_only}
        disabled={!usersExplorerContext.form.values.permissions.tags.view.is_allowed}
      />
      <GlobalCheckboxCard
        label={t('delete.label')}
        description={t('delete.description')}
        {...usersExplorerContext.form.getInputProps('permissions.tags.delete.is_allowed')}
        readOnly={usersExplorerContext.page.is_read_only}
        disabled={!usersExplorerContext.form.values.permissions.tags.view.is_allowed}
      />
      <GlobalCheckboxCard
        label={t('navigate.label')}
        description={t('navigate.description')}
        {...usersExplorerContext.form.getInputProps('permissions.tags.navigate.is_allowed')}
        readOnly={usersExplorerContext.page.is_read_only}
        disabled={!usersExplorerContext.form.values.permissions.tags.view.is_allowed}
      />
    </AppLayoutSection>
  );
}
