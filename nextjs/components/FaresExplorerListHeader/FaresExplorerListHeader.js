'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import ListHeader from '@/components/ListHeader/ListHeader';
import SearchField from '@/components/SearchField/SearchField';
import { useFaresExplorerContext } from '@/contexts/FaresExplorerContext';
import API from '@/services/API';
import notify from '@/services/notify';
import { useRouter } from '@/translations/navigation';
import { ActionIcon, Menu } from '@mantine/core';
import { IconCirclePlus, IconDots, IconFileDownload } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import useSWR from 'swr';

/* * */

export default function FaresExplorerListHeader() {
	//

	//
	// A. Setup variables

	const router = useRouter();
	const t = useTranslations('FaresExplorerListHeader');
	const [isCreating, setIsCreating] = useState(false);
	const faresExplorerContext = useFaresExplorerContext();

	//
	// B. Fetch data

	const { isLoading: allFaresLoading, mutate: allFaresMutate } = useSWR('/api/fares');

	//
	// C. Handle actions

	const handleCreate = async () => {
		try {
			setIsCreating(true);
			notify('new', 'loading', t('operations.create.loading'));
			const response = await API({ method: 'GET', operation: 'create', service: 'fares' });
			allFaresMutate();
			router.push(`/fares/${response._id}`);
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
			<SearchField onChange={faresExplorerContext.updateSearchQuery} query={faresExplorerContext.list.search_query} />
			<Menu position="bottom-end" shadow="md">
				<Menu.Target>
					<ActionIcon color="gray" loading={allFaresLoading || isCreating} size="lg" variant="light">
						<IconDots size={20} />
					</ActionIcon>
				</Menu.Target>
				<Menu.Dropdown>
					<AppAuthenticationCheck permissions={[{ action: 'create', scope: 'fares' }]}>
						<Menu.Item leftSection={<IconCirclePlus size={20} />} onClick={handleCreate}>
							{t('operations.create.title')}
						</Menu.Item>
					</AppAuthenticationCheck>
					<AppAuthenticationCheck permissions={[{ action: 'admin', scope: 'configs' }]}>
						<Menu.Item leftSection={<IconFileDownload size={20} />} onClick={faresExplorerContext.exportAttributesAsFile}>
							{t('operations.export_attributes.title')}
						</Menu.Item>
					</AppAuthenticationCheck>
					<AppAuthenticationCheck permissions={[{ action: 'admin', scope: 'configs' }]}>
						<Menu.Item leftSection={<IconFileDownload size={20} />} onClick={faresExplorerContext.exportRulesAsFile}>
							{t('operations.export_rules.title')}
						</Menu.Item>
					</AppAuthenticationCheck>
				</Menu.Dropdown>
			</Menu>
		</ListHeader>
	);

	//
}
