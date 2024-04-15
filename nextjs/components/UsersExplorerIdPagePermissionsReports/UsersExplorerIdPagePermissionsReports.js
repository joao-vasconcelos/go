'use client';

/* * */

import { useTranslations } from 'next-intl';
import { useUsersExplorerContext } from '@/contexts/UsersExplorerContext';
import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import GlobalCheckboxCard from '@/components/GlobalCheckboxCard/GlobalCheckboxCard';
import { MultiSelect, SimpleGrid } from '@mantine/core';
import { useMemo } from 'react';
import { ReportOptions } from '@/schemas/Report/options';

/* * */

export default function UsersExplorerIdPagePermissionsReports() {
  //

  //
  // A. Setup variables

  const reportOptionsLabels = useTranslations('ReportOptions');
  const t = useTranslations('UsersExplorerIdPagePermissionsReports');
  const usersExplorerContext = useUsersExplorerContext();

  //
  // B. Transform data

  const availableReportKinds = useMemo(() => {
    return ReportOptions.kind?.length > 0
      ? ReportOptions.kind.map((item) => {
          return { value: item, label: reportOptionsLabels(`kind.${item}.label`) };
        })
      : [];
  }, [reportOptionsLabels]);

  //
  // C. Render components

  return (
    <AppLayoutSection>
      <SimpleGrid cols={1}>
        <GlobalCheckboxCard label={t('view.label')} description={t('view.description')} {...usersExplorerContext.form.getInputProps('permissions.reports.view.is_allowed')} readOnly={usersExplorerContext.page.is_read_only}>
          <MultiSelect
            label={t('view.fields.kind.label')}
            placeholder={t('view.fields.kind.placeholder')}
            nothingFoundMessage={t('view.fields.kind.nothingFound')}
            {...usersExplorerContext.form.getInputProps('permissions.reports.view.fields.kind')}
            data={availableReportKinds}
            readOnly={usersExplorerContext.page.is_read_only}
            disabled={!usersExplorerContext.form.values.permissions.reports.view.is_allowed}
            searchable
          />
        </GlobalCheckboxCard>
        <GlobalCheckboxCard
          label={t('download.label')}
          description={t('download.description')}
          {...usersExplorerContext.form.getInputProps('permissions.reports.download.is_allowed')}
          readOnly={usersExplorerContext.page.is_read_only}
          disabled={!usersExplorerContext.form.values.permissions.reports.view.is_allowed}
        >
          <MultiSelect
            label={t('download.fields.kind.label')}
            placeholder={t('download.fields.kind.placeholder')}
            nothingFoundMessage={t('download.fields.kind.nothingFound')}
            {...usersExplorerContext.form.getInputProps('permissions.reports.download.fields.kind')}
            data={availableReportKinds}
            readOnly={usersExplorerContext.page.is_read_only}
            disabled={!usersExplorerContext.form.values.permissions.reports.view.is_allowed}
            searchable
          />
        </GlobalCheckboxCard>
        <GlobalCheckboxCard
          label={t('navigate.label')}
          description={t('navigate.description')}
          {...usersExplorerContext.form.getInputProps('permissions.reports.navigate.is_allowed')}
          readOnly={usersExplorerContext.page.is_read_only}
          disabled={!usersExplorerContext.form.values.permissions.reports.view.is_allowed}
        />
      </SimpleGrid>
    </AppLayoutSection>
  );
}
