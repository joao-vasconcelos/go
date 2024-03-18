'use client';

/* * */

import { useTranslations } from 'next-intl';
import { useUsersExplorerContext } from '@/contexts/UsersExplorerContext';
import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import GlobalCheckboxCard from '@/components/GlobalCheckboxCard/GlobalCheckboxCard';

/* * */

export default function UsersExplorerIdPagePermissionsArchives() {
  //

  //
  // A. Setup variables

  const t = useTranslations('UsersExplorerIdPagePermissionsArchives');
  const usersExplorerContext = useUsersExplorerContext();

  //
  // B. Render components

  return (
    <AppLayoutSection>
      <GlobalCheckboxCard label={t('view.label')} description={t('view.description')} {...usersExplorerContext.form.getInputProps('permissions.archives.view.is_allowed')} readOnly={usersExplorerContext.page.is_read_only} />
      <GlobalCheckboxCard label={t('create.label')} description={t('create.description')} {...usersExplorerContext.form.getInputProps('permissions.archives.create.is_allowed')} readOnly={usersExplorerContext.page.is_read_only} />
      <GlobalCheckboxCard label={t('lock.label')} description={t('lock.description')} {...usersExplorerContext.form.getInputProps('permissions.archives.lock.is_allowed')} readOnly={usersExplorerContext.page.is_read_only} />
      <GlobalCheckboxCard label={t('download.label')} description={t('download.description')} {...usersExplorerContext.form.getInputProps('permissions.archives.download.is_allowed')} readOnly={usersExplorerContext.page.is_read_only} />
      <GlobalCheckboxCard label={t('delete.label')} description={t('delete.description')} {...usersExplorerContext.form.getInputProps('permissions.archives.delete.is_allowed')} readOnly={usersExplorerContext.page.is_read_only} />
      <GlobalCheckboxCard label={t('navigate.label')} description={t('navigate.description')} {...usersExplorerContext.form.getInputProps('permissions.archives.navigate.is_allowed')} readOnly={usersExplorerContext.page.is_read_only} />
    </AppLayoutSection>
  );
}
