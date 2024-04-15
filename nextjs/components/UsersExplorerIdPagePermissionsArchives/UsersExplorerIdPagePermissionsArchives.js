'use client';

/* * */

import useSWR from 'swr';
import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useUsersExplorerContext } from '@/contexts/UsersExplorerContext';
import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import { MultiSelect } from '@mantine/core';
import GlobalCheckboxCard from '@/components/GlobalCheckboxCard/GlobalCheckboxCard';

/* * */

export default function UsersExplorerIdPagePermissionsArchives() {
  //

  //
  // A. Setup variables

  const t = useTranslations('UsersExplorerIdPagePermissionsArchives');
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
      <GlobalCheckboxCard label={t('view.label')} description={t('view.description')} {...usersExplorerContext.form.getInputProps('permissions.archives.view.is_allowed')} readOnly={usersExplorerContext.page.is_read_only}>
        <>
          <MultiSelect
            label={t('view.fields.agency.label')}
            placeholder={t('view.fields.agency.placeholder')}
            nothingFoundMessage={t('view.fields.agency.nothingFound')}
            {...usersExplorerContext.form.getInputProps('permissions.archives.view.fields.agency')}
            data={agenciesFormattedForSelect}
            readOnly={usersExplorerContext.page.is_read_only}
            disabled={!usersExplorerContext.form.values.permissions.archives.view.is_allowed}
            searchable
          />
        </>
      </GlobalCheckboxCard>
      <GlobalCheckboxCard label={t('edit.label')} description={t('edit.description')} {...usersExplorerContext.form.getInputProps('permissions.archives.edit.is_allowed')} readOnly={usersExplorerContext.page.is_read_only}>
        <>
          <MultiSelect
            label={t('edit.fields.agency.label')}
            placeholder={t('edit.fields.agency.placeholder')}
            nothingFoundMessage={t('edit.fields.agency.nothingFound')}
            {...usersExplorerContext.form.getInputProps('permissions.archives.edit.fields.agency')}
            data={agenciesFormattedForSelect}
            readOnly={usersExplorerContext.page.is_read_only}
            disabled={!usersExplorerContext.form.values.permissions.archives.edit.is_allowed}
            searchable
          />
        </>
      </GlobalCheckboxCard>
      <GlobalCheckboxCard label={t('create.label')} description={t('create.description')} {...usersExplorerContext.form.getInputProps('permissions.archives.create.is_allowed')} readOnly={usersExplorerContext.page.is_read_only} />
      <GlobalCheckboxCard label={t('lock.label')} description={t('lock.description')} {...usersExplorerContext.form.getInputProps('permissions.archives.lock.is_allowed')} readOnly={usersExplorerContext.page.is_read_only}>
        <>
          <MultiSelect
            label={t('lock.fields.agency.label')}
            placeholder={t('lock.fields.agency.placeholder')}
            nothingFoundMessage={t('lock.fields.agency.nothingFound')}
            {...usersExplorerContext.form.getInputProps('permissions.archives.lock.fields.agency')}
            data={agenciesFormattedForSelect}
            readOnly={usersExplorerContext.page.is_read_only}
            disabled={!usersExplorerContext.form.values.permissions.archives.lock.is_allowed}
            searchable
          />
        </>
      </GlobalCheckboxCard>
      <GlobalCheckboxCard label={t('delete.label')} description={t('delete.description')} {...usersExplorerContext.form.getInputProps('permissions.archives.delete.is_allowed')} readOnly={usersExplorerContext.page.is_read_only}>
        <>
          <MultiSelect
            label={t('delete.fields.agency.label')}
            placeholder={t('delete.fields.agency.placeholder')}
            nothingFoundMessage={t('delete.fields.agency.nothingFound')}
            {...usersExplorerContext.form.getInputProps('permissions.archives.delete.fields.agency')}
            data={agenciesFormattedForSelect}
            readOnly={usersExplorerContext.page.is_read_only}
            disabled={!usersExplorerContext.form.values.permissions.archives.delete.is_allowed}
            searchable
          />
        </>
      </GlobalCheckboxCard>
      <GlobalCheckboxCard label={t('navigate.label')} description={t('navigate.description')} {...usersExplorerContext.form.getInputProps('permissions.archives.navigate.is_allowed')} readOnly={usersExplorerContext.page.is_read_only} />
    </AppLayoutSection>
  );
}
