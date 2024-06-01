'use client';

/* * */

import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import GlobalCheckboxCard from '@/components/GlobalCheckboxCard/GlobalCheckboxCard';
import { useUsersExplorerContext } from '@/contexts/UsersExplorerContext';
import { ReportOptions } from '@/schemas/Report/options';
import { MultiSelect, SimpleGrid } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

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
				return { label: reportOptionsLabels(`kind.${item}.label`), value: item };
			})
			: [];
	}, [reportOptionsLabels]);

	//
	// C. Render components

	return (
		<AppLayoutSection>
			<SimpleGrid cols={1}>
				<GlobalCheckboxCard description={t('view.description')} label={t('view.label')} {...usersExplorerContext.form.getInputProps('permissions.reports.view.is_allowed')} readOnly={usersExplorerContext.page.is_read_only}>
					<MultiSelect
						label={t('view.fields.kind.label')}
						nothingFoundMessage={t('view.fields.kind.nothingFound')}
						placeholder={t('view.fields.kind.placeholder')}
						{...usersExplorerContext.form.getInputProps('permissions.reports.view.fields.kind')}
						data={availableReportKinds}
						disabled={!usersExplorerContext.form.values.permissions.reports.view.is_allowed}
						readOnly={usersExplorerContext.page.is_read_only}
						searchable
					/>
				</GlobalCheckboxCard>
				<GlobalCheckboxCard
					description={t('download.description')}
					label={t('download.label')}
					{...usersExplorerContext.form.getInputProps('permissions.reports.download.is_allowed')}
					disabled={!usersExplorerContext.form.values.permissions.reports.view.is_allowed}
					readOnly={usersExplorerContext.page.is_read_only}
				>
					<MultiSelect
						label={t('download.fields.kind.label')}
						nothingFoundMessage={t('download.fields.kind.nothingFound')}
						placeholder={t('download.fields.kind.placeholder')}
						{...usersExplorerContext.form.getInputProps('permissions.reports.download.fields.kind')}
						data={availableReportKinds}
						disabled={!usersExplorerContext.form.values.permissions.reports.view.is_allowed}
						readOnly={usersExplorerContext.page.is_read_only}
						searchable
					/>
				</GlobalCheckboxCard>
				<GlobalCheckboxCard
					description={t('navigate.description')}
					label={t('navigate.label')}
					{...usersExplorerContext.form.getInputProps('permissions.reports.navigate.is_allowed')}
					disabled={!usersExplorerContext.form.values.permissions.reports.view.is_allowed}
					readOnly={usersExplorerContext.page.is_read_only}
				/>
			</SimpleGrid>
		</AppLayoutSection>
	);
}
