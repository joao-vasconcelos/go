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
		return agenciesData ?
			agenciesData.map((item) => {
				return { value: item._id, label: item.name || '-' };
			}) :
			[];
	}, [agenciesData]);

	const exportKindsFormattedForSelect = useMemo(() => {
		return ExportOptions.kind.map((item) => {
			return { value: item, label: exportOptionsLabels(`kind.${item}.label`) };
		});
	}, [exportOptionsLabels]);

	//
	// D. Render components

	return (
		<AppLayoutSection>
			<GlobalCheckboxCard label={t('view.label')} description={t('view.description')} {...usersExplorerContext.form.getInputProps('permissions.exports.view.is_allowed')} readOnly={usersExplorerContext.page.is_read_only}>
				<>
					<MultiSelect
						label={t('view.fields.agency.label')}
						placeholder={t('view.fields.agency.placeholder')}
						nothingFoundMessage={t('view.fields.agency.nothingFound')}
						{...usersExplorerContext.form.getInputProps('permissions.exports.view.fields.agency')}
						data={agenciesFormattedForSelect}
						readOnly={usersExplorerContext.page.is_read_only}
						disabled={!usersExplorerContext.form.values.permissions.exports.view.is_allowed}
						searchable
					/>
					<MultiSelect
						label={t('view.fields.kind.label')}
						placeholder={t('view.fields.kind.placeholder')}
						nothingFoundMessage={t('view.fields.kind.nothingFound')}
						{...usersExplorerContext.form.getInputProps('permissions.exports.view.fields.kind')}
						data={exportKindsFormattedForSelect}
						readOnly={usersExplorerContext.page.is_read_only}
						disabled={!usersExplorerContext.form.values.permissions.exports.view.is_allowed}
						searchable
					/>
				</>
			</GlobalCheckboxCard>
			<GlobalCheckboxCard label={t('create.label')} description={t('create.description')} {...usersExplorerContext.form.getInputProps('permissions.exports.create.is_allowed')} readOnly={usersExplorerContext.page.is_read_only}>
				<>
					<MultiSelect
						label={t('create.fields.agency.label')}
						placeholder={t('create.fields.agency.placeholder')}
						nothingFoundMessage={t('create.fields.agency.nothingFound')}
						{...usersExplorerContext.form.getInputProps('permissions.exports.create.fields.agency')}
						data={agenciesFormattedForSelect}
						readOnly={usersExplorerContext.page.is_read_only}
						disabled={!usersExplorerContext.form.values.permissions.exports.create.is_allowed}
						searchable
					/>
					<MultiSelect
						label={t('create.fields.kind.label')}
						placeholder={t('create.fields.kind.placeholder')}
						nothingFoundMessage={t('create.fields.kind.nothingFound')}
						{...usersExplorerContext.form.getInputProps('permissions.exports.create.fields.kind')}
						data={exportKindsFormattedForSelect}
						readOnly={usersExplorerContext.page.is_read_only}
						disabled={!usersExplorerContext.form.values.permissions.exports.create.is_allowed}
						searchable
					/>
				</>
			</GlobalCheckboxCard>
			<GlobalCheckboxCard label={t('lock.label')} description={t('lock.description')} {...usersExplorerContext.form.getInputProps('permissions.exports.lock.is_allowed')} readOnly={usersExplorerContext.page.is_read_only}>
				<>
					<MultiSelect
						label={t('lock.fields.agency.label')}
						placeholder={t('lock.fields.agency.placeholder')}
						nothingFoundMessage={t('lock.fields.agency.nothingFound')}
						{...usersExplorerContext.form.getInputProps('permissions.exports.lock.fields.agency')}
						data={agenciesFormattedForSelect}
						readOnly={usersExplorerContext.page.is_read_only}
						disabled={!usersExplorerContext.form.values.permissions.exports.lock.is_allowed}
						searchable
					/>
					<MultiSelect
						label={t('lock.fields.kind.label')}
						placeholder={t('lock.fields.kind.placeholder')}
						nothingFoundMessage={t('lock.fields.kind.nothingFound')}
						{...usersExplorerContext.form.getInputProps('permissions.exports.lock.fields.kind')}
						data={exportKindsFormattedForSelect}
						readOnly={usersExplorerContext.page.is_read_only}
						disabled={!usersExplorerContext.form.values.permissions.exports.lock.is_allowed}
						searchable
					/>
				</>
			</GlobalCheckboxCard>
			<GlobalCheckboxCard label={t('download.label')} description={t('download.description')} {...usersExplorerContext.form.getInputProps('permissions.exports.download.is_allowed')} readOnly={usersExplorerContext.page.is_read_only}>
				<>
					<MultiSelect
						label={t('download.fields.agency.label')}
						placeholder={t('download.fields.agency.placeholder')}
						nothingFoundMessage={t('download.fields.agency.nothingFound')}
						{...usersExplorerContext.form.getInputProps('permissions.exports.download.fields.agency')}
						data={agenciesFormattedForSelect}
						readOnly={usersExplorerContext.page.is_read_only}
						disabled={!usersExplorerContext.form.values.permissions.exports.download.is_allowed}
						searchable
					/>
					<MultiSelect
						label={t('download.fields.kind.label')}
						placeholder={t('download.fields.kind.placeholder')}
						nothingFoundMessage={t('download.fields.kind.nothingFound')}
						{...usersExplorerContext.form.getInputProps('permissions.exports.download.fields.kind')}
						data={exportKindsFormattedForSelect}
						readOnly={usersExplorerContext.page.is_read_only}
						disabled={!usersExplorerContext.form.values.permissions.exports.download.is_allowed}
						searchable
					/>
				</>
			</GlobalCheckboxCard>
			<GlobalCheckboxCard label={t('delete.label')} description={t('delete.description')} {...usersExplorerContext.form.getInputProps('permissions.exports.delete.is_allowed')} readOnly={usersExplorerContext.page.is_read_only}>
				<>
					<MultiSelect
						label={t('delete.fields.agency.label')}
						placeholder={t('delete.fields.agency.placeholder')}
						nothingFoundMessage={t('delete.fields.agency.nothingFound')}
						{...usersExplorerContext.form.getInputProps('permissions.exports.delete.fields.agency')}
						data={agenciesFormattedForSelect}
						readOnly={usersExplorerContext.page.is_read_only}
						disabled={!usersExplorerContext.form.values.permissions.exports.delete.is_allowed}
						searchable
					/>
					<MultiSelect
						label={t('delete.fields.kind.label')}
						placeholder={t('delete.fields.kind.placeholder')}
						nothingFoundMessage={t('delete.fields.kind.nothingFound')}
						{...usersExplorerContext.form.getInputProps('permissions.exports.delete.fields.kind')}
						data={exportKindsFormattedForSelect}
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