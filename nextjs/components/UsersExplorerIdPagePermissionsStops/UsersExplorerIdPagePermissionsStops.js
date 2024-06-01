'use client';

/* * */

import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import GlobalCheckboxCard from '@/components/GlobalCheckboxCard/GlobalCheckboxCard';
import { useUsersExplorerContext } from '@/contexts/UsersExplorerContext';
import { useTranslations } from 'next-intl';

/* * */

export default function UsersExplorerIdPagePermissionsStops() {
	//

	//
	// A. Setup variables

	const t = useTranslations('UsersExplorerIdPagePermissionsStops');
	const usersExplorerContext = useUsersExplorerContext();

	//
	// B. Render components

	return (
		<AppLayoutSection>
			<GlobalCheckboxCard description={t('view.description')} label={t('view.label')} {...usersExplorerContext.form.getInputProps('permissions.stops.view.is_allowed')} readOnly={usersExplorerContext.page.is_read_only} />
			<GlobalCheckboxCard description={t('edit.description')} label={t('edit.label')} {...usersExplorerContext.form.getInputProps('permissions.stops.edit.is_allowed')} disabled={!usersExplorerContext.form.values.permissions.stops.view.is_allowed} readOnly={usersExplorerContext.page.is_read_only} />
			<GlobalCheckboxCard
				description={t('edit_code.description')}
				label={t('edit_code.label')}
				{...usersExplorerContext.form.getInputProps('permissions.stops.edit_code.is_allowed')}
				disabled={!usersExplorerContext.form.values.permissions.stops.view.is_allowed || !usersExplorerContext.form.values.permissions.stops.edit.is_allowed}
				readOnly={usersExplorerContext.page.is_read_only}
			/>
			<GlobalCheckboxCard
				description={t('edit_name.description')}
				label={t('edit_name.label')}
				{...usersExplorerContext.form.getInputProps('permissions.stops.edit_name.is_allowed')}
				disabled={!usersExplorerContext.form.values.permissions.stops.view.is_allowed || !usersExplorerContext.form.values.permissions.stops.edit.is_allowed}
				readOnly={usersExplorerContext.page.is_read_only}
			/>
			<GlobalCheckboxCard
				description={t('edit_location.description')}
				label={t('edit_location.label')}
				{...usersExplorerContext.form.getInputProps('permissions.stops.edit_location.is_allowed')}
				disabled={!usersExplorerContext.form.values.permissions.stops.view.is_allowed || !usersExplorerContext.form.values.permissions.stops.edit.is_allowed}
				readOnly={usersExplorerContext.page.is_read_only}
			/>
			<GlobalCheckboxCard
				description={t('edit_zones.description')}
				label={t('edit_zones.label')}
				{...usersExplorerContext.form.getInputProps('permissions.stops.edit_zones.is_allowed')}
				disabled={!usersExplorerContext.form.values.permissions.stops.view.is_allowed || !usersExplorerContext.form.values.permissions.stops.edit.is_allowed}
				readOnly={usersExplorerContext.page.is_read_only}
			/>
			<GlobalCheckboxCard description={t('lock.description')} label={t('lock.label')} {...usersExplorerContext.form.getInputProps('permissions.stops.lock.is_allowed')} disabled={!usersExplorerContext.form.values.permissions.stops.view.is_allowed} readOnly={usersExplorerContext.page.is_read_only} />
			<GlobalCheckboxCard
				description={t('create.description')}
				label={t('create.label')}
				{...usersExplorerContext.form.getInputProps('permissions.stops.create.is_allowed')}
				disabled={!usersExplorerContext.form.values.permissions.stops.view.is_allowed}
				readOnly={usersExplorerContext.page.is_read_only}
			/>
			<GlobalCheckboxCard
				description={t('delete.description')}
				label={t('delete.label')}
				{...usersExplorerContext.form.getInputProps('permissions.stops.delete.is_allowed')}
				disabled={!usersExplorerContext.form.values.permissions.stops.view.is_allowed}
				readOnly={usersExplorerContext.page.is_read_only}
			/>
			<GlobalCheckboxCard
				description={t('export.description')}
				label={t('export.label')}
				{...usersExplorerContext.form.getInputProps('permissions.stops.export.is_allowed')}
				disabled={!usersExplorerContext.form.values.permissions.stops.view.is_allowed}
				readOnly={usersExplorerContext.page.is_read_only}
			/>
			<GlobalCheckboxCard
				description={t('export_deleted.description')}
				label={t('export_deleted.label')}
				{...usersExplorerContext.form.getInputProps('permissions.stops.export_deleted.is_allowed')}
				disabled={!usersExplorerContext.form.values.permissions.stops.view.is_allowed}
				readOnly={usersExplorerContext.page.is_read_only}
			/>
			<GlobalCheckboxCard
				description={t('navigate.description')}
				label={t('navigate.label')}
				{...usersExplorerContext.form.getInputProps('permissions.stops.navigate.is_allowed')}
				disabled={!usersExplorerContext.form.values.permissions.stops.view.is_allowed}
				readOnly={usersExplorerContext.page.is_read_only}
			/>
		</AppLayoutSection>
	);
}
