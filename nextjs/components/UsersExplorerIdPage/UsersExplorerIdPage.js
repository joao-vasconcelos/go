'use client';

/* * */

import Pannel from '@/components/Pannel/Pannel';
import UsersExplorerIdPageDetails from '@/components/UsersExplorerIdPageDetails/UsersExplorerIdPageDetails';
import UsersExplorerIdPageHeader from '@/components/UsersExplorerIdPageHeader/UsersExplorerIdPageHeader';
import UsersExplorerIdPagePermissions from '@/components/UsersExplorerIdPagePermissions/UsersExplorerIdPagePermissions';
import { useUsersExplorerContext } from '@/contexts/UsersExplorerContext';
import { Divider } from '@mantine/core';
import { useTranslations } from 'next-intl';

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
		<Pannel header={<UsersExplorerIdPageHeader />} loading={usersExplorerContext.page.is_loading}>
			<UsersExplorerIdPageDetails />
			<Divider />
			<UsersExplorerIdPagePermissions />
		</Pannel>
	);
}
