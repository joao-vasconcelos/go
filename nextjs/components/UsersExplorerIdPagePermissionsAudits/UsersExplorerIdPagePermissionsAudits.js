'use client';

/* * */

import { useTranslations } from 'next-intl';
import { useUsersExplorerContext } from '@/contexts/UsersExplorerContext';
import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import GlobalCheckboxCard from '@/components/GlobalCheckboxCard/GlobalCheckboxCard';
import { SimpleGrid } from '@mantine/core';

/* * */

export default function UsersExplorerIdPagePermissionsAudits() {
	//

	//
	// A. Setup variables

	const t = useTranslations('UsersExplorerIdPagePermissionsAudits');
	const usersExplorerContext = useUsersExplorerContext();

	//
	// B. Render components

	return (
		<AppLayoutSection>
			<SimpleGrid cols={3}>
				<GlobalCheckboxCard label={t('view.label')} description={t('view.description')} {...usersExplorerContext.form.getInputProps('permissions.audits.view.is_allowed')} readOnly={usersExplorerContext.page.is_read_only} />
				<GlobalCheckboxCard
					label={t('edit.label')}
					description={t('edit.description')}
					{...usersExplorerContext.form.getInputProps('permissions.audits.edit.is_allowed')}
					readOnly={usersExplorerContext.page.is_read_only}
					disabled={!usersExplorerContext.form.values.permissions.audits.view.is_allowed}
				/>
				<GlobalCheckboxCard
					label={t('lock.label')}
					description={t('lock.description')}
					{...usersExplorerContext.form.getInputProps('permissions.audits.lock.is_allowed')}
					readOnly={usersExplorerContext.page.is_read_only}
					disabled={!usersExplorerContext.form.values.permissions.audits.view.is_allowed}
				/>
				<GlobalCheckboxCard
					label={t('create.label')}
					description={t('create.description')}
					{...usersExplorerContext.form.getInputProps('permissions.audits.create.is_allowed')}
					readOnly={usersExplorerContext.page.is_read_only}
					disabled={!usersExplorerContext.form.values.permissions.audits.view.is_allowed}
				/>
				<GlobalCheckboxCard
					label={t('delete.label')}
					description={t('delete.description')}
					{...usersExplorerContext.form.getInputProps('permissions.audits.delete.is_allowed')}
					readOnly={usersExplorerContext.page.is_read_only}
					disabled={!usersExplorerContext.form.values.permissions.audits.view.is_allowed}
				/>
				<GlobalCheckboxCard
					label={t('navigate.label')}
					description={t('navigate.description')}
					{...usersExplorerContext.form.getInputProps('permissions.audits.navigate.is_allowed')}
					readOnly={usersExplorerContext.page.is_read_only}
					disabled={!usersExplorerContext.form.values.permissions.audits.view.is_allowed}
				/>
			</SimpleGrid>
		</AppLayoutSection>
	);
}