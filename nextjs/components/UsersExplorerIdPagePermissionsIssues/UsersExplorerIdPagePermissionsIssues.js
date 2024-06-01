'use client';

/* * */

import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import GlobalCheckboxCard from '@/components/GlobalCheckboxCard/GlobalCheckboxCard';
import { useUsersExplorerContext } from '@/contexts/UsersExplorerContext';
import { useTranslations } from 'next-intl';

/* * */

export default function UsersExplorerIdPagePermissionsIssues() {
	//

	//
	// A. Setup variables

	const t = useTranslations('UsersExplorerIdPagePermissionsIssues');
	const usersExplorerContext = useUsersExplorerContext();

	//
	// B. Render components

	return (
		<AppLayoutSection>
			<GlobalCheckboxCard description={t('view.description')} label={t('view.label')} {...usersExplorerContext.form.getInputProps('permissions.issues.view.is_allowed')} readOnly={usersExplorerContext.page.is_read_only} />
			<GlobalCheckboxCard
				description={t('edit.description')}
				label={t('edit.label')}
				{...usersExplorerContext.form.getInputProps('permissions.issues.edit.is_allowed')}
				disabled={!usersExplorerContext.form.values.permissions.issues.view.is_allowed}
				readOnly={usersExplorerContext.page.is_read_only}
			/>
			<GlobalCheckboxCard
				description={t('lock.description')}
				label={t('lock.label')}
				{...usersExplorerContext.form.getInputProps('permissions.issues.lock.is_allowed')}
				disabled={!usersExplorerContext.form.values.permissions.issues.view.is_allowed}
				readOnly={usersExplorerContext.page.is_read_only}
			/>
			<GlobalCheckboxCard
				description={t('create.description')}
				label={t('create.label')}
				{...usersExplorerContext.form.getInputProps('permissions.issues.create.is_allowed')}
				disabled={!usersExplorerContext.form.values.permissions.issues.view.is_allowed}
				readOnly={usersExplorerContext.page.is_read_only}
			/>
			<GlobalCheckboxCard
				description={t('delete.description')}
				label={t('delete.label')}
				{...usersExplorerContext.form.getInputProps('permissions.issues.delete.is_allowed')}
				disabled={!usersExplorerContext.form.values.permissions.issues.view.is_allowed}
				readOnly={usersExplorerContext.page.is_read_only}
			/>
			<GlobalCheckboxCard
				description={t('navigate.description')}
				label={t('navigate.label')}
				{...usersExplorerContext.form.getInputProps('permissions.issues.navigate.is_allowed')}
				disabled={!usersExplorerContext.form.values.permissions.issues.view.is_allowed}
				readOnly={usersExplorerContext.page.is_read_only}
			/>
		</AppLayoutSection>
	);
}
