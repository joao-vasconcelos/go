'use client';

/* * */

import { useTranslations } from 'next-intl';
import { useUsersExplorerContext } from '@/contexts/UsersExplorerContext';
import { Divider } from '@mantine/core';
import Pannel from '@/components/Pannel/Pannel';
import UsersExplorerIdPageHeader from '@/components/UsersExplorerIdPageHeader/UsersExplorerIdPageHeader';
import UsersExplorerIdPageDetails from '@/components/UsersExplorerIdPageDetails/UsersExplorerIdPageDetails';
import UsersExplorerIdPagePermissions from '@/components/UsersExplorerIdPagePermissions/UsersExplorerIdPagePermissions';

/* * */

export default function UsersExplorerIdPage() {
	//

	//
	// A. Setup variables

	const t = useTranslations('UsersExplorerIdPage');
	const usersExplorerContext = useUsersExplorerContext();

	//
	// B. Render components

	return (
		<Pannel loading={usersExplorerContext.page.is_loading} header={<UsersExplorerIdPageHeader />}>
			<UsersExplorerIdPageDetails />
			<Divider />
			<UsersExplorerIdPagePermissions />
		</Pannel>
	);
}