'use client';

/* * */

import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import { useUsersExplorerContext } from '@/contexts/UsersExplorerContext';
import { SimpleGrid, TextInput } from '@mantine/core';
import { useTranslations } from 'next-intl';

/* * */

export default function UsersExplorerIdPageDetails() {
	//

	//
	// A. Setup variables

	const t = useTranslations('UsersExplorerIdPageDetails');
	const usersExplorerContext = useUsersExplorerContext();

	//
	// B. Render components

	return (
		<AppLayoutSection description={t('description')} title={t('title')}>
			<SimpleGrid cols={1}>
				<TextInput label={t('form.name.label')} placeholder={t('form.name.placeholder')} {...usersExplorerContext.form.getInputProps('name')} readOnly={usersExplorerContext.page.is_read_only} />
			</SimpleGrid>
			<SimpleGrid cols={2}>
				<TextInput label={t('form.email.label')} placeholder={t('form.email.placeholder')} {...usersExplorerContext.form.getInputProps('email')} readOnly={usersExplorerContext.page.is_read_only} />
				<TextInput label={t('form.phone.label')} placeholder={t('form.phone.placeholder')} {...usersExplorerContext.form.getInputProps('phone')} readOnly={usersExplorerContext.page.is_read_only} />
			</SimpleGrid>
		</AppLayoutSection>
	);
}
