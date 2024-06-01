'use client';

/* * */

import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import GlobalCheckboxCard from '@/components/GlobalCheckboxCard/GlobalCheckboxCard';
import { useUsersExplorerContext } from '@/contexts/UsersExplorerContext';
import { ExportOptions } from '@/schemas/Export/options';
import { MultiSelect } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import useSWR from 'swr';

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
				return { label: item.name || '-', value: item._id };
			})
			: [];
	}, [agenciesData]);

	const exportKindsFormattedForSelect = useMemo(() => {
		return ExportOptions.kind.map((item) => {
			return { label: exportOptionsLabels(`kind.${item}.label`), value: item };
		});
	}, [exportOptionsLabels]);

	//
	// D. Render components

	return (
		<AppLayoutSection>
			<GlobalCheckboxCard description={t('view.description')} label={t('view.label')} {...usersExplorerContext.form.getInputProps('permissions.exports.view.is_allowed')} readOnly={usersExplorerContext.page.is_read_only}>
				<>
					<MultiSelect
						label={t('view.fields.agency.label')}
						nothingFoundMessage={t('view.fields.agency.nothingFound')}
						placeholder={t('view.fields.agency.placeholder')}
						{...usersExplorerContext.form.getInputProps('permissions.exports.view.fields.agency')}
						data={agenciesFormattedForSelect}
						disabled={!usersExplorerContext.form.values.permissions.exports.view.is_allowed}
						readOnly={usersExplorerContext.page.is_read_only}
						searchable
					/>
					<MultiSelect
						label={t('view.fields.kind.label')}
						nothingFoundMessage={t('view.fields.kind.nothingFound')}
						placeholder={t('view.fields.kind.placeholder')}
						{...usersExplorerContext.form.getInputProps('permissions.exports.view.fields.kind')}
						data={exportKindsFormattedForSelect}
						disabled={!usersExplorerContext.form.values.permissions.exports.view.is_allowed}
						readOnly={usersExplorerContext.page.is_read_only}
						searchable
					/>
				</>
			</GlobalCheckboxCard>
			<GlobalCheckboxCard description={t('create.description')} label={t('create.label')} {...usersExplorerContext.form.getInputProps('permissions.exports.create.is_allowed')} readOnly={usersExplorerContext.page.is_read_only}>
				<>
					<MultiSelect
						label={t('create.fields.agency.label')}
						nothingFoundMessage={t('create.fields.agency.nothingFound')}
						placeholder={t('create.fields.agency.placeholder')}
						{...usersExplorerContext.form.getInputProps('permissions.exports.create.fields.agency')}
						data={agenciesFormattedForSelect}
						disabled={!usersExplorerContext.form.values.permissions.exports.create.is_allowed}
						readOnly={usersExplorerContext.page.is_read_only}
						searchable
					/>
					<MultiSelect
						label={t('create.fields.kind.label')}
						nothingFoundMessage={t('create.fields.kind.nothingFound')}
						placeholder={t('create.fields.kind.placeholder')}
						{...usersExplorerContext.form.getInputProps('permissions.exports.create.fields.kind')}
						data={exportKindsFormattedForSelect}
						disabled={!usersExplorerContext.form.values.permissions.exports.create.is_allowed}
						readOnly={usersExplorerContext.page.is_read_only}
						searchable
					/>
				</>
			</GlobalCheckboxCard>
			<GlobalCheckboxCard description={t('lock.description')} label={t('lock.label')} {...usersExplorerContext.form.getInputProps('permissions.exports.lock.is_allowed')} readOnly={usersExplorerContext.page.is_read_only}>
				<>
					<MultiSelect
						label={t('lock.fields.agency.label')}
						nothingFoundMessage={t('lock.fields.agency.nothingFound')}
						placeholder={t('lock.fields.agency.placeholder')}
						{...usersExplorerContext.form.getInputProps('permissions.exports.lock.fields.agency')}
						data={agenciesFormattedForSelect}
						disabled={!usersExplorerContext.form.values.permissions.exports.lock.is_allowed}
						readOnly={usersExplorerContext.page.is_read_only}
						searchable
					/>
					<MultiSelect
						label={t('lock.fields.kind.label')}
						nothingFoundMessage={t('lock.fields.kind.nothingFound')}
						placeholder={t('lock.fields.kind.placeholder')}
						{...usersExplorerContext.form.getInputProps('permissions.exports.lock.fields.kind')}
						data={exportKindsFormattedForSelect}
						disabled={!usersExplorerContext.form.values.permissions.exports.lock.is_allowed}
						readOnly={usersExplorerContext.page.is_read_only}
						searchable
					/>
				</>
			</GlobalCheckboxCard>
			<GlobalCheckboxCard description={t('download.description')} label={t('download.label')} {...usersExplorerContext.form.getInputProps('permissions.exports.download.is_allowed')} readOnly={usersExplorerContext.page.is_read_only}>
				<>
					<MultiSelect
						label={t('download.fields.agency.label')}
						nothingFoundMessage={t('download.fields.agency.nothingFound')}
						placeholder={t('download.fields.agency.placeholder')}
						{...usersExplorerContext.form.getInputProps('permissions.exports.download.fields.agency')}
						data={agenciesFormattedForSelect}
						disabled={!usersExplorerContext.form.values.permissions.exports.download.is_allowed}
						readOnly={usersExplorerContext.page.is_read_only}
						searchable
					/>
					<MultiSelect
						label={t('download.fields.kind.label')}
						nothingFoundMessage={t('download.fields.kind.nothingFound')}
						placeholder={t('download.fields.kind.placeholder')}
						{...usersExplorerContext.form.getInputProps('permissions.exports.download.fields.kind')}
						data={exportKindsFormattedForSelect}
						disabled={!usersExplorerContext.form.values.permissions.exports.download.is_allowed}
						readOnly={usersExplorerContext.page.is_read_only}
						searchable
					/>
				</>
			</GlobalCheckboxCard>
			<GlobalCheckboxCard description={t('delete.description')} label={t('delete.label')} {...usersExplorerContext.form.getInputProps('permissions.exports.delete.is_allowed')} readOnly={usersExplorerContext.page.is_read_only}>
				<>
					<MultiSelect
						label={t('delete.fields.agency.label')}
						nothingFoundMessage={t('delete.fields.agency.nothingFound')}
						placeholder={t('delete.fields.agency.placeholder')}
						{...usersExplorerContext.form.getInputProps('permissions.exports.delete.fields.agency')}
						data={agenciesFormattedForSelect}
						disabled={!usersExplorerContext.form.values.permissions.exports.delete.is_allowed}
						readOnly={usersExplorerContext.page.is_read_only}
						searchable
					/>
					<MultiSelect
						label={t('delete.fields.kind.label')}
						nothingFoundMessage={t('delete.fields.kind.nothingFound')}
						placeholder={t('delete.fields.kind.placeholder')}
						{...usersExplorerContext.form.getInputProps('permissions.exports.delete.fields.kind')}
						data={exportKindsFormattedForSelect}
						disabled={!usersExplorerContext.form.values.permissions.exports.delete.is_allowed}
						readOnly={usersExplorerContext.page.is_read_only}
						searchable
					/>
				</>
			</GlobalCheckboxCard>
			<GlobalCheckboxCard description={t('navigate.description')} label={t('navigate.label')} {...usersExplorerContext.form.getInputProps('permissions.exports.navigate.is_allowed')} readOnly={usersExplorerContext.page.is_read_only} />
		</AppLayoutSection>
	);
}
