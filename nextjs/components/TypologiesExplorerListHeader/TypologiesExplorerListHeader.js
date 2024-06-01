'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import ListHeader from '@/components/ListHeader/ListHeader';
import SearchField from '@/components/SearchField/SearchField';
import { useTypologiesExplorerContext } from '@/contexts/TypologiesExplorerContext';
import API from '@/services/API';
import notify from '@/services/notify';
import { useRouter } from '@/translations/navigation';
import { ActionIcon, Menu } from '@mantine/core';
import { IconCirclePlus, IconDots } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import useSWR from 'swr';

/* * */

export default function TypologiesExplorerListHeader() {
	//

	//
	// A. Setup variables

	const router = useRouter();
	const t = useTranslations('TypologiesExplorerListHeader');
	const [isCreating, setIsCreating] = useState(false);
	const typologiesExplorerContext = useTypologiesExplorerContext();

	//
	// B. Fetch data

	const { isLoading: allTypologiesLoading, mutate: allTypologiesMutate } = useSWR('/api/typologies');

	//
	// C. Handle actions

	const handleCreate = async () => {
		try {
			setIsCreating(true);
			notify('new', 'loading', t('operations.create.loading'));
			const response = await API({ method: 'GET', operation: 'create', service: 'typologies' });
			allTypologiesMutate();
			router.push(`/typologies/${response._id}`);
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
			<SearchField onChange={typologiesExplorerContext.updateSearchQuery} query={typologiesExplorerContext.list.search_query} />
			<Menu position="bottom-end" shadow="md">
				<Menu.Target>
					<ActionIcon color="gray" loading={allTypologiesLoading || isCreating} size="lg" variant="light">
						<IconDots size={20} />
					</ActionIcon>
				</Menu.Target>
				<Menu.Dropdown>
					<AppAuthenticationCheck permissions={[{ action: 'create', scope: 'typologies' }]}>
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
