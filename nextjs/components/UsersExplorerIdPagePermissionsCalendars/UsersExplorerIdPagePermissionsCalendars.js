'use client';

/* * */

import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import GlobalCheckboxCard from '@/components/GlobalCheckboxCard/GlobalCheckboxCard';
import { useUsersExplorerContext } from '@/contexts/UsersExplorerContext';
import { SimpleGrid } from '@mantine/core';
import { useTranslations } from 'next-intl';

/* * */

export default function UsersExplorerIdPagePermissionsCalendars() {
	//

	//
	// A. Setup variables

	const t = useTranslations('UsersExplorerIdPagePermissionsCalendars');
	const usersExplorerContext = useUsersExplorerContext();

	//
	// B. Render components

	return (
		<AppLayoutSection>
			<SimpleGrid cols={3}>
				<GlobalCheckboxCard description={t('view.description')} label={t('view.label')} {...usersExplorerContext.form.getInputProps('permissions.calendars.view.is_allowed')} readOnly={usersExplorerContext.page.is_read_only} />
				<GlobalCheckboxCard
					description={t('edit.description')}
					label={t('edit.label')}
					{...usersExplorerContext.form.getInputProps('permissions.calendars.edit.is_allowed')}
					disabled={!usersExplorerContext.form.values.permissions.calendars.view.is_allowed}
					readOnly={usersExplorerContext.page.is_read_only}
				/>
				<GlobalCheckboxCard
					description={t('lock.description')}
					label={t('lock.label')}
					{...usersExplorerContext.form.getInputProps('permissions.calendars.lock.is_allowed')}
					disabled={!usersExplorerContext.form.values.permissions.calendars.view.is_allowed}
					readOnly={usersExplorerContext.page.is_read_only}
				/>
				<GlobalCheckboxCard
					description={t('create.description')}
					label={t('create.label')}
					{...usersExplorerContext.form.getInputProps('permissions.calendars.create.is_allowed')}
					disabled={!usersExplorerContext.form.values.permissions.calendars.view.is_allowed}
					readOnly={usersExplorerContext.page.is_read_only}
				/>
				<GlobalCheckboxCard
					description={t('delete.description')}
					label={t('delete.label')}
					{...usersExplorerContext.form.getInputProps('permissions.calendars.delete.is_allowed')}
					disabled={!usersExplorerContext.form.values.permissions.calendars.view.is_allowed}
					readOnly={usersExplorerContext.page.is_read_only}
				/>
				<GlobalCheckboxCard
					description={t('navigate.description')}
					label={t('navigate.label')}
					{...usersExplorerContext.form.getInputProps('permissions.calendars.navigate.is_allowed')}
					disabled={!usersExplorerContext.form.values.permissions.calendars.view.is_allowed}
					readOnly={usersExplorerContext.page.is_read_only}
				/>
				<GlobalCheckboxCard
					description={t('edit_dates.description')}
					label={t('edit_dates.label')}
					{...usersExplorerContext.form.getInputProps('permissions.calendars.edit_dates.is_allowed')}
					disabled={!usersExplorerContext.form.values.permissions.calendars.view.is_allowed}
					readOnly={usersExplorerContext.page.is_read_only}
				/>
				<GlobalCheckboxCard
					description={t('export_dates.description')}
					label={t('export_dates.label')}
					{...usersExplorerContext.form.getInputProps('permissions.calendars.export_dates.is_allowed')}
					disabled={!usersExplorerContext.form.values.permissions.calendars.view.is_allowed}
					readOnly={usersExplorerContext.page.is_read_only}
				/>
			</SimpleGrid>
		</AppLayoutSection>
	);
}
