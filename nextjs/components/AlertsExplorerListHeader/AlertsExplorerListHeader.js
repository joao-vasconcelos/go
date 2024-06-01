'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import ListHeader from '@/components/ListHeader/ListHeader';
import SearchField from '@/components/SearchField/SearchField';
import { useAlertsExplorerContext } from '@/contexts/AlertsExplorerContext';
import API from '@/services/API';
import notify from '@/services/notify';
import { useRouter } from '@/translations/navigation';
import { ActionIcon, Menu } from '@mantine/core';
import { IconCirclePlus, IconDots } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import useSWR from 'swr';

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
			const response = await API({ method: 'GET', operation: 'create', service: 'alerts' });
			allAlertsMutate();
			router.push(`/alerts/${response._id}`);
			notify('new', 'success', t('operations.create.success'));
			setIsCreating(false);
		}
		catch (error) {
			notify('new', 'error', error.message || t('operations.create.error'));
			setIsCreating(false);
			console.log(error);
		}
	};

	//
	// D. Render components

	return (
		<ListHeader>
			<SearchField onChange={alertsExplorerContext.updateSearchQuery} query={alertsExplorerContext.list.search_query} />
			<Menu position="bottom-end" shadow="md">
				<Menu.Target>
					<ActionIcon color="gray" loading={allAlertsLoading || isCreating} size="lg" variant="light">
						<IconDots size={20} />
					</ActionIcon>
				</Menu.Target>
				<Menu.Dropdown>
					<AppAuthenticationCheck permissions={[{ action: 'create', scope: 'alerts' }]}>
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
