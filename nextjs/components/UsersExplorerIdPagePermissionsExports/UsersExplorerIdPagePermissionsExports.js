'use client';

/* * */

import useSWR from 'swr';
import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { MultiSelect } from '@mantine/core';
import { useUsersExplorerContext } from '@/contexts/UsersExplorerContext';
import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import GlobalCheckboxCard from '@/components/GlobalCheckboxCard/GlobalCheckboxCard';
import { ExportOptions } from '@/schemas/Export/options';

/* * */

export default function UsersExplorerIdPagePermissionsExports() {
  //

  //
  // A. Setup variables

  const t = useTranslations('UsersExplorerIdPagePermissionsExports');
  const exportOptionsLabels = useTranslations('ExportOptions');
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

  const exportTypesFormattedForSelect = useMemo(() => {
    return ExportOptions.export_type.map((item) => {
      return { value: item, label: exportOptionsLabels(`export_type.${item}.label`) };
    });
  }, [exportOptionsLabels]);

  //
  // D. Render components

  return (
    <AppLayoutSection>
      <GlobalCheckboxCard label={t('view.label')} description={t('view.description')} {...usersExplorerContext.form.getInputProps('permissions.exports.view.is_allowed')} readOnly={usersExplorerContext.page.is_read_only}>
        <>
          <MultiSelect
            label={t('view.fields.agencies.label')}
            placeholder={t('view.fields.agencies.placeholder')}
            nothingFoundMessage={t('view.fields.agencies.nothingFound')}
            {...usersExplorerContext.form.getInputProps('permissions.exports.view.fields.agencies')}
            data={agenciesFormattedForSelect}
            readOnly={usersExplorerContext.page.is_read_only}
            disabled={!usersExplorerContext.form.values.permissions.exports.view.is_allowed}
            searchable
          />
          <MultiSelect
            label={t('view.fields.export_types.label')}
            placeholder={t('view.fields.export_types.placeholder')}
            nothingFoundMessage={t('view.fields.export_types.nothingFound')}
            {...usersExplorerContext.form.getInputProps('permissions.exports.view.fields.export_types')}
            data={exportTypesFormattedForSelect}
            readOnly={usersExplorerContext.page.is_read_only}
            disabled={!usersExplorerContext.form.values.permissions.exports.view.is_allowed}
            searchable
          />
        </>
      </GlobalCheckboxCard>
      <GlobalCheckboxCard label={t('create.label')} description={t('create.description')} {...usersExplorerContext.form.getInputProps('permissions.exports.create.is_allowed')} readOnly={usersExplorerContext.page.is_read_only}>
        <>
          <MultiSelect
            label={t('create.fields.agencies.label')}
            placeholder={t('create.fields.agencies.placeholder')}
            nothingFoundMessage={t('create.fields.agencies.nothingFound')}
            {...usersExplorerContext.form.getInputProps('permissions.exports.create.fields.agencies')}
            data={agenciesFormattedForSelect}
            readOnly={usersExplorerContext.page.is_read_only}
            disabled={!usersExplorerContext.form.values.permissions.exports.create.is_allowed}
            searchable
          />
          <MultiSelect
            label={t('create.fields.export_types.label')}
            placeholder={t('create.fields.export_types.placeholder')}
            nothingFoundMessage={t('create.fields.export_types.nothingFound')}
            {...usersExplorerContext.form.getInputProps('permissions.exports.create.fields.export_types')}
            data={exportTypesFormattedForSelect}
            readOnly={usersExplorerContext.page.is_read_only}
            disabled={!usersExplorerContext.form.values.permissions.exports.create.is_allowed}
            searchable
          />
        </>
      </GlobalCheckboxCard>
      <GlobalCheckboxCard label={t('lock.label')} description={t('lock.description')} {...usersExplorerContext.form.getInputProps('permissions.exports.lock.is_allowed')} readOnly={usersExplorerContext.page.is_read_only}>
        <>
          <MultiSelect
            label={t('lock.fields.agencies.label')}
            placeholder={t('lock.fields.agencies.placeholder')}
            nothingFoundMessage={t('lock.fields.agencies.nothingFound')}
            {...usersExplorerContext.form.getInputProps('permissions.exports.lock.fields.agencies')}
            data={agenciesFormattedForSelect}
            readOnly={usersExplorerContext.page.is_read_only}
            disabled={!usersExplorerContext.form.values.permissions.exports.lock.is_allowed}
            searchable
          />
          <MultiSelect
            label={t('lock.fields.export_types.label')}
            placeholder={t('lock.fields.export_types.placeholder')}
            nothingFoundMessage={t('lock.fields.export_types.nothingFound')}
            {...usersExplorerContext.form.getInputProps('permissions.exports.lock.fields.export_types')}
            data={exportTypesFormattedForSelect}
            readOnly={usersExplorerContext.page.is_read_only}
            disabled={!usersExplorerContext.form.values.permissions.exports.lock.is_allowed}
            searchable
          />
        </>
      </GlobalCheckboxCard>
      <GlobalCheckboxCard label={t('download.label')} description={t('download.description')} {...usersExplorerContext.form.getInputProps('permissions.exports.download.is_allowed')} readOnly={usersExplorerContext.page.is_read_only}>
        <>
          <MultiSelect
            label={t('download.fields.agencies.label')}
            placeholder={t('download.fields.agencies.placeholder')}
            nothingFoundMessage={t('download.fields.agencies.nothingFound')}
            {...usersExplorerContext.form.getInputProps('permissions.exports.download.fields.agencies')}
            data={agenciesFormattedForSelect}
            readOnly={usersExplorerContext.page.is_read_only}
            disabled={!usersExplorerContext.form.values.permissions.exports.download.is_allowed}
            searchable
          />
          <MultiSelect
            label={t('download.fields.export_types.label')}
            placeholder={t('download.fields.export_types.placeholder')}
            nothingFoundMessage={t('download.fields.export_types.nothingFound')}
            {...usersExplorerContext.form.getInputProps('permissions.exports.download.fields.export_types')}
            data={exportTypesFormattedForSelect}
            readOnly={usersExplorerContext.page.is_read_only}
            disabled={!usersExplorerContext.form.values.permissions.exports.download.is_allowed}
            searchable
          />
        </>
      </GlobalCheckboxCard>
      <GlobalCheckboxCard label={t('delete.label')} description={t('delete.description')} {...usersExplorerContext.form.getInputProps('permissions.exports.delete.is_allowed')} readOnly={usersExplorerContext.page.is_read_only}>
        <>
          <MultiSelect
            label={t('delete.fields.agencies.label')}
            placeholder={t('delete.fields.agencies.placeholder')}
            nothingFoundMessage={t('delete.fields.agencies.nothingFound')}
            {...usersExplorerContext.form.getInputProps('permissions.exports.delete.fields.agencies')}
            data={agenciesFormattedForSelect}
            readOnly={usersExplorerContext.page.is_read_only}
            disabled={!usersExplorerContext.form.values.permissions.exports.delete.is_allowed}
            searchable
          />
          <MultiSelect
            label={t('delete.fields.export_types.label')}
            placeholder={t('delete.fields.export_types.placeholder')}
            nothingFoundMessage={t('delete.fields.export_types.nothingFound')}
            {...usersExplorerContext.form.getInputProps('permissions.exports.delete.fields.export_types')}
            data={exportTypesFormattedForSelect}
            readOnly={usersExplorerContext.page.is_read_only}
            disabled={!usersExplorerContext.form.values.permissions.exports.delete.is_allowed}
            searchable
          />
        </>
      </GlobalCheckboxCard>
      <GlobalCheckboxCard label={t('navigate.label')} description={t('navigate.description')} {...usersExplorerContext.form.getInputProps('permissions.exports.navigate.is_allowed')} readOnly={usersExplorerContext.page.is_read_only} />
    </AppLayoutSection>
  );
}
