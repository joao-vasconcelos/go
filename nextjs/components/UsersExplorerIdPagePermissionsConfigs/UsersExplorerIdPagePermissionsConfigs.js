'use client';

/* * */

import { useTranslations } from 'next-intl';
import { useUsersExplorerContext } from '@/contexts/UsersExplorerContext';
import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import GlobalCheckboxCard from '@/components/GlobalCheckboxCard/GlobalCheckboxCard';

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
      <GlobalCheckboxCard label={t('admin.label')} description={t('admin.description')} {...usersExplorerContext.form.getInputProps('permissions.configs.admin.is_allowed')} readOnly={usersExplorerContext.page.is_read_only} />
    </AppLayoutSection>
  );
}
