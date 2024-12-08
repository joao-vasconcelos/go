'use client';

/* * */

import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import GlobalCheckboxCard from '@/components/GlobalCheckboxCard/GlobalCheckboxCard';
import { useUsersExplorerContext } from '@/contexts/UsersExplorerContext';
import { MultiSelect } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import useSWR from 'swr';

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
				return { label: item.name || '-', value: item._id };
			})
			: [];
	}, [agenciesData]);

	//
	// D. Render components

	return (
		<AppLayoutSection>
			<GlobalCheckboxCard description={t('view.description')} label={t('view.label')} {...usersExplorerContext.form.getInputProps('permissions.plans.view.is_allowed')} readOnly={usersExplorerContext.page.is_read_only}>
				<>
					<MultiSelect
						label={t('view.fields.agency.label')}
						nothingFoundMessage={t('view.fields.agency.nothingFound')}
						placeholder={t('view.fields.agency.placeholder')}
						{...usersExplorerContext.form.getInputProps('permissions.plans.view.fields.agency')}
						data={agenciesFormattedForSelect}
						disabled={!usersExplorerContext.form.values.permissions.plans.view.is_allowed}
						readOnly={usersExplorerContext.page.is_read_only}
						searchable
					/>
				</>
			</GlobalCheckboxCard>
			<GlobalCheckboxCard description={t('edit.description')} label={t('edit.label')} {...usersExplorerContext.form.getInputProps('permissions.plans.edit.is_allowed')} readOnly={usersExplorerContext.page.is_read_only}>
				<>
					<MultiSelect
						label={t('edit.fields.agency.label')}
						nothingFoundMessage={t('edit.fields.agency.nothingFound')}
						placeholder={t('edit.fields.agency.placeholder')}
						{...usersExplorerContext.form.getInputProps('permissions.plans.edit.fields.agency')}
						data={agenciesFormattedForSelect}
						disabled={!usersExplorerContext.form.values.permissions.plans.edit.is_allowed}
						readOnly={usersExplorerContext.page.is_read_only}
						searchable
					/>
				</>
			</GlobalCheckboxCard>
			<GlobalCheckboxCard description={t('create.description')} label={t('create.label')} {...usersExplorerContext.form.getInputProps('permissions.plans.create.is_allowed')} readOnly={usersExplorerContext.page.is_read_only} />
			<GlobalCheckboxCard description={t('lock.description')} label={t('lock.label')} {...usersExplorerContext.form.getInputProps('permissions.plans.lock.is_allowed')} readOnly={usersExplorerContext.page.is_read_only}>
				<>
					<MultiSelect
						label={t('lock.fields.agency.label')}
						nothingFoundMessage={t('lock.fields.agency.nothingFound')}
						placeholder={t('lock.fields.agency.placeholder')}
						{...usersExplorerContext.form.getInputProps('permissions.plans.lock.fields.agency')}
						data={agenciesFormattedForSelect}
						disabled={!usersExplorerContext.form.values.permissions.plans.lock.is_allowed}
						readOnly={usersExplorerContext.page.is_read_only}
						searchable
					/>
				</>
			</GlobalCheckboxCard>
			<GlobalCheckboxCard description={t('delete.description')} label={t('delete.label')} {...usersExplorerContext.form.getInputProps('permissions.plans.delete.is_allowed')} readOnly={usersExplorerContext.page.is_read_only}>
				<>
					<MultiSelect
						label={t('delete.fields.agency.label')}
						nothingFoundMessage={t('delete.fields.agency.nothingFound')}
						placeholder={t('delete.fields.agency.placeholder')}
						{...usersExplorerContext.form.getInputProps('permissions.plans.delete.fields.agency')}
						data={agenciesFormattedForSelect}
						disabled={!usersExplorerContext.form.values.permissions.plans.delete.is_allowed}
						readOnly={usersExplorerContext.page.is_read_only}
						searchable
					/>
				</>
			</GlobalCheckboxCard>
			<GlobalCheckboxCard description={t('navigate.description')} label={t('navigate.label')} {...usersExplorerContext.form.getInputProps('permissions.plans.navigate.is_allowed')} readOnly={usersExplorerContext.page.is_read_only} />
		</AppLayoutSection>
	);
}
