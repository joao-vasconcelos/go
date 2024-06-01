'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import ListHeader from '@/components/ListHeader/ListHeader';
import SearchField from '@/components/SearchField/SearchField';
import { useArchivesExplorerContext } from '@/contexts/ArchivesExplorerContext';
import API from '@/services/API';
import notify from '@/services/notify';
import { Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import useSWR from 'swr';

/* * */

export default function ArchivesExplorerListHeader() {
	//

	//
	// A. Setup variables

	const t = useTranslations('ArchivesExplorerListHeader');
	const [isCreating, setIsCreating] = useState(false);
	const archivesExplorerContext = useArchivesExplorerContext();

	//
	// B. Fetch data

	const { isLoading: allArchivesLoading, mutate: allArchivesMutate } = useSWR('/api/archives');

	//
	// C. Handle actions

	const handleCreate = async () => {
		try {
			setIsCreating(true);
			notify('new', 'loading', t('operations.create.loading'));
			await API({ method: 'GET', operation: 'create', service: 'archives' });
			allArchivesMutate();
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
			<AppAuthenticationCheck permissions={[{ action: 'create', scope: 'archives' }]}>
				<div>
					<Button color="gray" leftSection={<IconPlus size={20} />} loading={allArchivesLoading || isCreating} onClick={handleCreate} variant="light">
						{t('operations.create.title')}
					</Button>
				</div>
			</AppAuthenticationCheck>
			<SearchField onChange={archivesExplorerContext.updateSearchQuery} query={archivesExplorerContext.list.search_query} />
		</ListHeader>
	);

	//
}
