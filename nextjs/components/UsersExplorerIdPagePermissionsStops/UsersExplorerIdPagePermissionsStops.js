'use client';

/* * */

import { useTranslations } from 'next-intl';
import { useUsersExplorerContext } from '@/contexts/UsersExplorerContext';
import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import GlobalCheckboxCard from '@/components/GlobalCheckboxCard/GlobalCheckboxCard';

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
			<GlobalCheckboxCard label={t('view.label')} description={t('view.description')} {...usersExplorerContext.form.getInputProps('permissions.stops.view.is_allowed')} readOnly={usersExplorerContext.page.is_read_only} />
			<GlobalCheckboxCard label={t('edit.label')} description={t('edit.description')} {...usersExplorerContext.form.getInputProps('permissions.stops.edit.is_allowed')} readOnly={usersExplorerContext.page.is_read_only} disabled={!usersExplorerContext.form.values.permissions.stops.view.is_allowed} />
			<GlobalCheckboxCard
				label={t('edit_code.label')}
				description={t('edit_code.description')}
				{...usersExplorerContext.form.getInputProps('permissions.stops.edit_code.is_allowed')}
				readOnly={usersExplorerContext.page.is_read_only}
				disabled={!usersExplorerContext.form.values.permissions.stops.view.is_allowed || !usersExplorerContext.form.values.permissions.stops.edit.is_allowed}
			/>
			<GlobalCheckboxCard
				label={t('edit_name.label')}
				description={t('edit_name.description')}
				{...usersExplorerContext.form.getInputProps('permissions.stops.edit_name.is_allowed')}
				readOnly={usersExplorerContext.page.is_read_only}
				disabled={!usersExplorerContext.form.values.permissions.stops.view.is_allowed || !usersExplorerContext.form.values.permissions.stops.edit.is_allowed}
			/>
			<GlobalCheckboxCard
				label={t('edit_location.label')}
				description={t('edit_location.description')}
				{...usersExplorerContext.form.getInputProps('permissions.stops.edit_location.is_allowed')}
				readOnly={usersExplorerContext.page.is_read_only}
				disabled={!usersExplorerContext.form.values.permissions.stops.view.is_allowed || !usersExplorerContext.form.values.permissions.stops.edit.is_allowed}
			/>
			<GlobalCheckboxCard
				label={t('edit_zones.label')}
				description={t('edit_zones.description')}
				{...usersExplorerContext.form.getInputProps('permissions.stops.edit_zones.is_allowed')}
				readOnly={usersExplorerContext.page.is_read_only}
				disabled={!usersExplorerContext.form.values.permissions.stops.view.is_allowed || !usersExplorerContext.form.values.permissions.stops.edit.is_allowed}
			/>
			<GlobalCheckboxCard label={t('lock.label')} description={t('lock.description')} {...usersExplorerContext.form.getInputProps('permissions.stops.lock.is_allowed')} readOnly={usersExplorerContext.page.is_read_only} disabled={!usersExplorerContext.form.values.permissions.stops.view.is_allowed} />
			<GlobalCheckboxCard
				label={t('create.label')}
				description={t('create.description')}
				{...usersExplorerContext.form.getInputProps('permissions.stops.create.is_allowed')}
				readOnly={usersExplorerContext.page.is_read_only}
				disabled={!usersExplorerContext.form.values.permissions.stops.view.is_allowed}
			/>
			<GlobalCheckboxCard
				label={t('delete.label')}
				description={t('delete.description')}
				{...usersExplorerContext.form.getInputProps('permissions.stops.delete.is_allowed')}
				readOnly={usersExplorerContext.page.is_read_only}
				disabled={!usersExplorerContext.form.values.permissions.stops.view.is_allowed}
			/>
			<GlobalCheckboxCard
				label={t('export.label')}
				description={t('export.description')}
				{...usersExplorerContext.form.getInputProps('permissions.stops.export.is_allowed')}
				readOnly={usersExplorerContext.page.is_read_only}
				disabled={!usersExplorerContext.form.values.permissions.stops.view.is_allowed}
			/>
			<GlobalCheckboxCard
				label={t('export_deleted.label')}
				description={t('export_deleted.description')}
				{...usersExplorerContext.form.getInputProps('permissions.stops.export_deleted.is_allowed')}
				readOnly={usersExplorerContext.page.is_read_only}
				disabled={!usersExplorerContext.form.values.permissions.stops.view.is_allowed}
			/>
			<GlobalCheckboxCard
				label={t('navigate.label')}
				description={t('navigate.description')}
				{...usersExplorerContext.form.getInputProps('permissions.stops.navigate.is_allowed')}
				readOnly={usersExplorerContext.page.is_read_only}
				disabled={!usersExplorerContext.form.values.permissions.stops.view.is_allowed}
			/>
		</AppLayoutSection>
	);
}