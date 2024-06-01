'use client';

/* * */

import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import GlobalCheckboxCard from '@/components/GlobalCheckboxCard/GlobalCheckboxCard';
import { useUsersExplorerContext } from '@/contexts/UsersExplorerContext';
import { SimpleGrid } from '@mantine/core';
import { useTranslations } from 'next-intl';

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
				<GlobalCheckboxCard description={t('view.description')} label={t('view.label')} {...usersExplorerContext.form.getInputProps('permissions.fares.view.is_allowed')} readOnly={usersExplorerContext.page.is_read_only} />
				<GlobalCheckboxCard
					description={t('edit.description')}
					label={t('edit.label')}
					{...usersExplorerContext.form.getInputProps('permissions.fares.edit.is_allowed')}
					disabled={!usersExplorerContext.form.values.permissions.fares.view.is_allowed}
					readOnly={usersExplorerContext.page.is_read_only}
				/>
				<GlobalCheckboxCard
					description={t('lock.description')}
					label={t('lock.label')}
					{...usersExplorerContext.form.getInputProps('permissions.fares.lock.is_allowed')}
					disabled={!usersExplorerContext.form.values.permissions.fares.view.is_allowed}
					readOnly={usersExplorerContext.page.is_read_only}
				/>
				<GlobalCheckboxCard
					description={t('create.description')}
					label={t('create.label')}
					{...usersExplorerContext.form.getInputProps('permissions.fares.create.is_allowed')}
					disabled={!usersExplorerContext.form.values.permissions.fares.view.is_allowed}
					readOnly={usersExplorerContext.page.is_read_only}
				/>
				<GlobalCheckboxCard
					description={t('delete.description')}
					label={t('delete.label')}
					{...usersExplorerContext.form.getInputProps('permissions.fares.delete.is_allowed')}
					disabled={!usersExplorerContext.form.values.permissions.fares.view.is_allowed}
					readOnly={usersExplorerContext.page.is_read_only}
				/>
				<GlobalCheckboxCard
					description={t('navigate.description')}
					label={t('navigate.label')}
					{...usersExplorerContext.form.getInputProps('permissions.fares.navigate.is_allowed')}
					disabled={!usersExplorerContext.form.values.permissions.fares.view.is_allowed}
					readOnly={usersExplorerContext.page.is_read_only}
				/>
			</SimpleGrid>
		</AppLayoutSection>
	);
}
