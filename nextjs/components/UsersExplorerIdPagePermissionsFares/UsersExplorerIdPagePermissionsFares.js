'use client';

/* * */

import { useTranslations } from 'next-intl';
import { useUsersExplorerContext } from '@/contexts/UsersExplorerContext';
import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import GlobalCheckboxCard from '@/components/GlobalCheckboxCard/GlobalCheckboxCard';
import { SimpleGrid } from '@mantine/core';

/* * */

export default function UsersExplorerIdPagePermissionsFares() {
  //

  //
  // A. Setup variables

  const t = useTranslations('UsersExplorerIdPagePermissionsFares');
  const usersExplorerContext = useUsersExplorerContext();

  //
  // B. Render components

  return (
    <AppLayoutSection>
      <SimpleGrid cols={3}>
        <GlobalCheckboxCard label={t('view.label')} description={t('view.description')} {...usersExplorerContext.form.getInputProps('permissions.fares.view.is_allowed')} readOnly={usersExplorerContext.page.is_read_only} />
        <GlobalCheckboxCard
          label={t('edit.label')}
          description={t('edit.description')}
          {...usersExplorerContext.form.getInputProps('permissions.fares.edit.is_allowed')}
          readOnly={usersExplorerContext.page.is_read_only}
          disabled={!usersExplorerContext.form.values.permissions.fares.view.is_allowed}
        />
        <GlobalCheckboxCard
          label={t('lock.label')}
          description={t('lock.description')}
          {...usersExplorerContext.form.getInputProps('permissions.fares.lock.is_allowed')}
          readOnly={usersExplorerContext.page.is_read_only}
          disabled={!usersExplorerContext.form.values.permissions.fares.view.is_allowed}
        />
        <GlobalCheckboxCard
          label={t('create.label')}
          description={t('create.description')}
          {...usersExplorerContext.form.getInputProps('permissions.fares.create.is_allowed')}
          readOnly={usersExplorerContext.page.is_read_only}
          disabled={!usersExplorerContext.form.values.permissions.fares.view.is_allowed}
        />
        <GlobalCheckboxCard
          label={t('delete.label')}
          description={t('delete.description')}
          {...usersExplorerContext.form.getInputProps('permissions.fares.delete.is_allowed')}
          readOnly={usersExplorerContext.page.is_read_only}
          disabled={!usersExplorerContext.form.values.permissions.fares.view.is_allowed}
        />
        <GlobalCheckboxCard
          label={t('navigate.label')}
          description={t('navigate.description')}
          {...usersExplorerContext.form.getInputProps('permissions.fares.navigate.is_allowed')}
          readOnly={usersExplorerContext.page.is_read_only}
          disabled={!usersExplorerContext.form.values.permissions.fares.view.is_allowed}
        />
      </SimpleGrid>
    </AppLayoutSection>
  );
}
