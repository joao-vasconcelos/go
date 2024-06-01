'use client';

/* * */

import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import GlobalCheckboxCard from '@/components/GlobalCheckboxCard/GlobalCheckboxCard';
import { useUsersExplorerContext } from '@/contexts/UsersExplorerContext';
import { useTranslations } from 'next-intl';

/* * */

export default function UsersExplorerIdPagePermissionsConfigs() {
	//

	//
	// A. Setup variables

	const t = useTranslations('UsersExplorerIdPagePermissionsConfigs');
	const usersExplorerContext = useUsersExplorerContext();

	//
	// B. Render components

	return (
		<AppLayoutSection>
			<GlobalCheckboxCard description={t('admin.description')} label={t('admin.label')} {...usersExplorerContext.form.getInputProps('permissions.configs.admin.is_allowed')} readOnly={usersExplorerContext.page.is_read_only} />
		</AppLayoutSection>
	);
}
