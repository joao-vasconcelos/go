'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import ListHeader from '@/components/ListHeader/ListHeader';
import SearchField from '@/components/SearchField/SearchField';
import { useMediaExplorerContext } from '@/contexts/MediaExplorerContext';
import API from '@/services/API';
import notify from '@/services/notify';
import { useRouter } from '@/translations/navigation';
import { ActionIcon, Menu } from '@mantine/core';
import { IconCirclePlus, IconDots } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import useSWR from 'swr';

/* * */

export default function MediaExplorerListHeader() {
	//

	//
	// A. Setup variables

	const router = useRouter();
	const t = useTranslations('MediaExplorerListHeader');
	const [isCreating, setIsCreating] = useState(false);
	const mediaExplorerContext = useMediaExplorerContext();

	//
	// B. Fetch data

	const { isLoading: allMediaLoading, mutate: allMediaMutate } = useSWR('/api/media');

	//
	// C. Handle actions

	const handleCreate = async () => {
		try {
			setIsCreating(true);
			notify('new', 'loading', t('operations.create.loading'));
			const response = await API({ method: 'GET', operation: 'create', service: 'media' });
			allMediaMutate();
			router.push(`/media/${response._id}`);
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
			<SearchField onChange={mediaExplorerContext.updateSearchQuery} query={mediaExplorerContext.list.search_query} />
			<Menu position="bottom-end" shadow="md">
				<Menu.Target>
					<ActionIcon color="gray" loading={allMediaLoading || isCreating} size="lg" variant="light">
						<IconDots size={20} />
					</ActionIcon>
				</Menu.Target>
				<Menu.Dropdown>
					<AppAuthenticationCheck permissions={[{ action: 'create', scope: 'media' }]}>
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
