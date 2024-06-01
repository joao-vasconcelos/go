'use client';

/* * */

import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import GlobalCheckboxCard from '@/components/GlobalCheckboxCard/GlobalCheckboxCard';
import { useUsersExplorerContext } from '@/contexts/UsersExplorerContext';
import { SimpleGrid } from '@mantine/core';
import { useTranslations } from 'next-intl';

/* * */

export default function UsersExplorerIdPagePermissionsUsers() {
	//

	//
	// A. Setup variables

	const t = useTranslations('UsersExplorerIdPagePermissionsUsers');
	const usersExplorerContext = useUsersExplorerContext();

	//
	// B. Render components

	return (
		<AppLayoutSection>
			<SimpleGrid cols={3}>
				<GlobalCheckboxCard description={t('view.description')} label={t('view.label')} {...usersExplorerContext.form.getInputProps('permissions.users.view.is_allowed')} readOnly={usersExplorerContext.page.is_read_only} />
				<GlobalCheckboxCard
					description={t('edit.description')}
					label={t('edit.label')}
					{...usersExplorerContext.form.getInputProps('permissions.users.edit.is_allowed')}
					disabled={!usersExplorerContext.form.values.permissions.users.view.is_allowed}
					readOnly={usersExplorerContext.page.is_read_only}
				/>
				<GlobalCheckboxCard
					description={t('lock.description')}
					label={t('lock.label')}
					{...usersExplorerContext.form.getInputProps('permissions.users.lock.is_allowed')}
					disabled={!usersExplorerContext.form.values.permissions.users.view.is_allowed}
					readOnly={usersExplorerContext.page.is_read_only}
				/>
				<GlobalCheckboxCard
					description={t('create.description')}
					label={t('create.label')}
					{...usersExplorerContext.form.getInputProps('permissions.users.create.is_allowed')}
					disabled={!usersExplorerContext.form.values.permissions.users.view.is_allowed}
					readOnly={usersExplorerContext.page.is_read_only}
				/>
				<GlobalCheckboxCard
					description={t('delete.description')}
					label={t('delete.label')}
					{...usersExplorerContext.form.getInputProps('permissions.users.delete.is_allowed')}
					disabled={!usersExplorerContext.form.values.permissions.users.view.is_allowed}
					readOnly={usersExplorerContext.page.is_read_only}
				/>
				<GlobalCheckboxCard
					description={t('navigate.description')}
					label={t('navigate.label')}
					{...usersExplorerContext.form.getInputProps('permissions.users.navigate.is_allowed')}
					disabled={!usersExplorerContext.form.values.permissions.users.view.is_allowed}
					readOnly={usersExplorerContext.page.is_read_only}
				/>
			</SimpleGrid>
		</AppLayoutSection>
	);
}
