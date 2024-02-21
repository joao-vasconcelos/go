'use client';

/* * */

import useSWR from 'swr';
import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { MultiSelect } from '@mantine/core';
import { useUsersExplorerContext } from '@/contexts/UsersExplorerContext';
import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import GlobalCheckboxCard from '@/components/GlobalCheckboxCard/GlobalCheckboxCard';

/* * */

export default function UsersExplorerIdPagePermissionsLines() {
  //

  //
  // A. Setup variables

  const t = useTranslations('UsersExplorerIdPagePermissionsLines');
  const usersExplorerContext = useUsersExplorerContext();

  //
  // B. Fetch data

  const { data: agenciesData } = useSWR('/api/agencies');

  //
  // C. Transform data

  const agenciesFormattedForSelect = useMemo(() => {
    return agenciesData
      ? agenciesData.map((item) => {
          return { value: item._id, label: item.name || '-' };
        })
      : [];
  }, [agenciesData]);

  //
  // D. Render components

  return (
    <AppLayoutSection>
      <GlobalCheckboxCard label={t('view.label')} description={t('view.description')} {...usersExplorerContext.form.getInputProps('permissions.lines.view.is_allowed')} readOnly={usersExplorerContext.page.is_read_only}>
        <MultiSelect
          label={t('view.fields.agencies.label')}
          placeholder={t('view.fields.agencies.placeholder')}
          nothingFoundMessage={t('view.fields.agencies.nothingFound')}
          {...usersExplorerContext.form.getInputProps('permissions.lines.view.fields.agencies')}
          data={agenciesFormattedForSelect}
          readOnly={usersExplorerContext.page.is_read_only}
          disabled={!usersExplorerContext.form.values.permissions.lines.view.is_allowed}
          searchable
        />
      </GlobalCheckboxCard>
      <GlobalCheckboxCard label={t('edit.label')} description={t('edit.description')} {...usersExplorerContext.form.getInputProps('permissions.lines.edit.is_allowed')} readOnly={usersExplorerContext.page.is_read_only}>
        <MultiSelect
          label={t('edit.fields.agencies.label')}
          placeholder={t('edit.fields.agencies.placeholder')}
          nothingFoundMessage={t('edit.fields.agencies.nothingFound')}
          {...usersExplorerContext.form.getInputProps('permissions.lines.edit.fields.agencies')}
          data={agenciesFormattedForSelect}
          readOnly={usersExplorerContext.page.is_read_only}
          disabled={!usersExplorerContext.form.values.permissions.lines.edit.is_allowed}
          searchable
        />
      </GlobalCheckboxCard>
      <GlobalCheckboxCard label={t('create.label')} description={t('create.description')} {...usersExplorerContext.form.getInputProps('permissions.lines.create.is_allowed')} readOnly={usersExplorerContext.page.is_read_only}>
        <MultiSelect
          label={t('create.fields.agencies.label')}
          placeholder={t('create.fields.agencies.placeholder')}
          nothingFoundMessage={t('create.fields.agencies.nothingFound')}
          {...usersExplorerContext.form.getInputProps('permissions.lines.create.fields.agencies')}
          data={agenciesFormattedForSelect}
          readOnly={usersExplorerContext.page.is_read_only}
          disabled={!usersExplorerContext.form.values.permissions.lines.create.is_allowed}
          searchable
        />
      </GlobalCheckboxCard>
      <GlobalCheckboxCard label={t('lock.label')} description={t('lock.description')} {...usersExplorerContext.form.getInputProps('permissions.lines.lock.is_allowed')} readOnly={usersExplorerContext.page.is_read_only}>
        <MultiSelect
          label={t('lock.fields.agencies.label')}
          placeholder={t('lock.fields.agencies.placeholder')}
          nothingFoundMessage={t('lock.fields.agencies.nothingFound')}
          {...usersExplorerContext.form.getInputProps('permissions.lines.lock.fields.agencies')}
          data={agenciesFormattedForSelect}
          readOnly={usersExplorerContext.page.is_read_only}
          disabled={!usersExplorerContext.form.values.permissions.lines.lock.is_allowed}
          searchable
        />
      </GlobalCheckboxCard>
      <GlobalCheckboxCard label={t('delete.label')} description={t('delete.description')} {...usersExplorerContext.form.getInputProps('permissions.lines.delete.is_allowed')} readOnly={usersExplorerContext.page.is_read_only}>
        <MultiSelect
          label={t('delete.fields.agencies.label')}
          placeholder={t('delete.fields.agencies.placeholder')}
          nothingFoundMessage={t('delete.fields.agencies.nothingFound')}
          {...usersExplorerContext.form.getInputProps('permissions.lines.delete.fields.agencies')}
          data={agenciesFormattedForSelect}
          readOnly={usersExplorerContext.page.is_read_only}
          disabled={!usersExplorerContext.form.values.permissions.lines.delete.is_allowed}
          searchable
        />
      </GlobalCheckboxCard>
      <GlobalCheckboxCard label={t('navigate.label')} description={t('navigate.description')} {...usersExplorerContext.form.getInputProps('permissions.lines.navigate.is_allowed')} readOnly={usersExplorerContext.page.is_read_only} />
    </AppLayoutSection>
  );

  //
}
