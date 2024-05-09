'use client';

/* * */

import { useState } from 'react';
import { useRouter } from '@/translations/navigation';
import useSWR from 'swr';
import API from '@/services/API';
import { ActionIcon, Menu } from '@mantine/core';
import { IconCirclePlus, IconDots } from '@tabler/icons-react';
import notify from '@/services/notify';
import { useTranslations } from 'next-intl';
import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import SearchField from '@/components/SearchField/SearchField';
import { useUsersExplorerContext } from '@/contexts/UsersExplorerContext';
import ListHeader from '@/components/ListHeader/ListHeader';

/* * */

export default function UsersExplorerListHeader() {
	//

	//
	// A. Setup variables

	const router = useRouter();
	const t = useTranslations('UsersExplorerListHeader');
	const [isCreating, setIsCreating] = useState(false);
	const usersExplorerContext = useUsersExplorerContext();

	//
	// B. Fetch data

	const { isLoading: allUsersLoading, mutate: allUsersMutate } = useSWR('/api/users');

	//
	// C. Handle actions

	const handleCreate = async () => {
		try {
			setIsCreating(true);
			notify('new', 'loading', t('operations.create.loading'));
			const response = await API({ service: 'users', operation: 'create', method: 'GET' });
			allUsersMutate();
			router.push(`/users/${response._id}`);
			notify('new', 'success', t('operations.create.success'));
			setIsCreating(false);
		} catch (error) {
			notify('new', 'error', error.message || t('operations.create.error'));
			setIsCreating(false);
			console.log(error);
		}
	};

	//
	// D. Render components

	return (
		<ListHeader>
			<SearchField query={usersExplorerContext.list.search_query} onChange={usersExplorerContext.updateSearchQuery} />
			<Menu shadow="md" position="bottom-end">
				<Menu.Target>
					<ActionIcon variant="light" size="lg" color="gray" loading={allUsersLoading || isCreating}>
						<IconDots size={20} />
					</ActionIcon>
				</Menu.Target>
				<Menu.Dropdown>
					<AppAuthenticationCheck permissions={[{ scope: 'users', action: 'create' }]}>
						<Menu.Item leftSection={<IconCirclePlus size={20} />} onClick={handleCreate}>
							{t('operations.create.title')}
						</Menu.Item>
					</AppAuthenticationCheck>
				</Menu.Dropdown>
			</Menu>
		</ListHeader>
	);

	//
}