'use client';

/* * */

import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import GlobalCheckboxCard from '@/components/GlobalCheckboxCard/GlobalCheckboxCard';
import { useUsersExplorerContext } from '@/contexts/UsersExplorerContext';
import { MultiSelect, SimpleGrid } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import useSWR from 'swr';

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
				return { label: item.name || '-', value: item._id };
			})
			: [];
	}, [agenciesData]);

	//
	// D. Render components

	return (
		<AppLayoutSection>
			<GlobalCheckboxCard description={t('view.description')} label={t('view.label')} {...usersExplorerContext.form.getInputProps('permissions.lines.view.is_allowed')} readOnly={usersExplorerContext.page.is_read_only}>
				<MultiSelect
					label={t('view.fields.agencies.label')}
					nothingFoundMessage={t('view.fields.agencies.nothingFound')}
					placeholder={t('view.fields.agencies.placeholder')}
					{...usersExplorerContext.form.getInputProps('permissions.lines.view.fields.agencies')}
					data={agenciesFormattedForSelect}
					disabled={!usersExplorerContext.form.values.permissions.lines.view.is_allowed}
					readOnly={usersExplorerContext.page.is_read_only}
					searchable
				/>
			</GlobalCheckboxCard>
			<GlobalCheckboxCard description={t('edit.description')} label={t('edit.label')} {...usersExplorerContext.form.getInputProps('permissions.lines.edit.is_allowed')} readOnly={usersExplorerContext.page.is_read_only}>
				<MultiSelect
					label={t('edit.fields.agencies.label')}
					nothingFoundMessage={t('edit.fields.agencies.nothingFound')}
					placeholder={t('edit.fields.agencies.placeholder')}
					{...usersExplorerContext.form.getInputProps('permissions.lines.edit.fields.agencies')}
					data={agenciesFormattedForSelect}
					disabled={!usersExplorerContext.form.values.permissions.lines.edit.is_allowed}
					readOnly={usersExplorerContext.page.is_read_only}
					searchable
				/>
			</GlobalCheckboxCard>
			<GlobalCheckboxCard description={t('create.description')} label={t('create.label')} {...usersExplorerContext.form.getInputProps('permissions.lines.create.is_allowed')} readOnly={usersExplorerContext.page.is_read_only} />
			<GlobalCheckboxCard description={t('lock.description')} label={t('lock.label')} {...usersExplorerContext.form.getInputProps('permissions.lines.lock.is_allowed')} readOnly={usersExplorerContext.page.is_read_only}>
				<MultiSelect
					label={t('lock.fields.agencies.label')}
					nothingFoundMessage={t('lock.fields.agencies.nothingFound')}
					placeholder={t('lock.fields.agencies.placeholder')}
					{...usersExplorerContext.form.getInputProps('permissions.lines.lock.fields.agencies')}
					data={agenciesFormattedForSelect}
					disabled={!usersExplorerContext.form.values.permissions.lines.lock.is_allowed}
					readOnly={usersExplorerContext.page.is_read_only}
					searchable
				/>
			</GlobalCheckboxCard>
			<GlobalCheckboxCard description={t('delete.description')} label={t('delete.label')} {...usersExplorerContext.form.getInputProps('permissions.lines.delete.is_allowed')} readOnly={usersExplorerContext.page.is_read_only}>
				<MultiSelect
					label={t('delete.fields.agencies.label')}
					nothingFoundMessage={t('delete.fields.agencies.nothingFound')}
					placeholder={t('delete.fields.agencies.placeholder')}
					{...usersExplorerContext.form.getInputProps('permissions.lines.delete.fields.agencies')}
					data={agenciesFormattedForSelect}
					disabled={!usersExplorerContext.form.values.permissions.lines.delete.is_allowed}
					readOnly={usersExplorerContext.page.is_read_only}
					searchable
				/>
			</GlobalCheckboxCard>
			<GlobalCheckboxCard description={t('navigate.description')} label={t('navigate.label')} {...usersExplorerContext.form.getInputProps('permissions.lines.navigate.is_allowed')} readOnly={usersExplorerContext.page.is_read_only} />
		</AppLayoutSection>
	);

	//
}
