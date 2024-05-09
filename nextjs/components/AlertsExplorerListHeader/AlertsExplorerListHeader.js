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
import { useAlertsExplorerContext } from '@/contexts/AlertsExplorerContext';
import ListHeader from '@/components/ListHeader/ListHeader';

/* * */

export default function AlertsExplorerListHeader() {
	//

	//
	// A. Setup variables

	const router = useRouter();
	const t = useTranslations('AlertsExplorerListHeader');
	const [isCreating, setIsCreating] = useState(false);
	const alertsExplorerContext = useAlertsExplorerContext();

	//
	// B. Fetch data

	const { isLoading: allAlertsLoading, mutate: allAlertsMutate } = useSWR('/api/alerts');

	//
	// C. Handle actions

	const handleCreate = async () => {
		try {
			setIsCreating(true);
			notify('new', 'loading', t('operations.create.loading'));
			const response = await API({ service: 'alerts', operation: 'create', method: 'GET' });
			allAlertsMutate();
			router.push(`/alerts/${response._id}`);
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
			<SearchField query={alertsExplorerContext.list.search_query} onChange={alertsExplorerContext.updateSearchQuery} />
			<Menu shadow="md" position="bottom-end">
				<Menu.Target>
					<ActionIcon variant="light" size="lg" color="gray" loading={allAlertsLoading || isCreating}>
						<IconDots size={20} />
					</ActionIcon>
				</Menu.Target>
				<Menu.Dropdown>
					<AppAuthenticationCheck permissions={[{ scope: 'alerts', action: 'create' }]}>
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