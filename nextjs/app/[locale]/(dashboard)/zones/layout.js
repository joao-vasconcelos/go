'use client';

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import ErrorDisplay from '@/components/ErrorDisplay';
import { TwoUnevenColumns } from '@/components/Layouts/Layouts';
import ListFooter from '@/components/ListFooter/ListFooter';
import ListHeader from '@/components/ListHeader/ListHeader';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import Pannel from '@/components/Pannel/Pannel';
import SearchField from '@/components/SearchField/SearchField';
import useSearch from '@/hooks/useSearch';
import API from '@/services/API';
import notify from '@/services/notify';
import { ActionIcon, Menu } from '@mantine/core';
import { IconCirclePlus, IconDots } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import useSWR from 'swr';

import ListItem from './listItem';

export default function Layout({ children }) {
	//

	//
	// A. Setup variables

	const router = useRouter();
	const t = useTranslations('zones');

	const [searchQuery, setSearchQuery] = useState('');
	const [isCreating, setIsCreating] = useState(false);

	//
	// B. Fetch data

	const { data: allZonesData, error: allZonesError, isLoading: allZonesLoading, isValidating: allZonesValidating, mutate: allZonesMutate } = useSWR('/api/zones');

	//
	// C. Search

	const filteredZonesData = useSearch(searchQuery, allZonesData);

	//
	// C. Handle actions

	const handleCreate = async () => {
		try {
			setIsCreating(true);
			notify('new', 'loading', t('operations.create.loading'));
			const response = await API({ method: 'GET', operation: 'create', service: 'zones' });
			allZonesMutate();
			router.push(`/zones/${response._id}`);
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
	// D. Render data

	return (
		<AppAuthenticationCheck permissions={[{ action: 'navigate', scope: 'zones' }]} redirect>
			<TwoUnevenColumns
				second={children}
				first={(
					<Pannel
						footer={filteredZonesData && <ListFooter>{t('list.footer', { count: filteredZonesData.length })}</ListFooter>}
						loading={allZonesLoading}
						header={(
							<ListHeader>
								<SearchField onChange={setSearchQuery} query={searchQuery} />
								<Menu position="bottom-end" shadow="md">
									<Menu.Target>
										<ActionIcon color="gray" loading={allZonesLoading || isCreating} size="lg" variant="light">
											<IconDots size={20} />
										</ActionIcon>
									</Menu.Target>
									<Menu.Dropdown>
										<AppAuthenticationCheck permissions={[{ action: 'create', scope: 'zones' }]}>
											<Menu.Item icon={<IconCirclePlus size={20} />} onClick={handleCreate}>
												{t('operations.create.title')}
											</Menu.Item>
										</AppAuthenticationCheck>
									</Menu.Dropdown>
								</Menu>
							</ListHeader>
						)}
					>
						<ErrorDisplay error={allZonesError} loading={allZonesValidating} />
						{filteredZonesData && filteredZonesData.length > 0 ? filteredZonesData.map(item => <ListItem key={item._id} _id={item._id} code={item.code} name={item.name} />) : <NoDataLabel />}
					</Pannel>
				)}
			/>
		</AppAuthenticationCheck>
	);
}
