'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import API from '@/services/API';
import { TwoUnevenColumns } from '@/components/Layouts/Layouts';
import Pannel from '@/components/Pannel/Pannel';
import ListItem from './listItem';
import { ActionIcon, Menu } from '@mantine/core';
import { IconCirclePlus, IconDots, IconFileDownload } from '@tabler/icons-react';
import notify from '@/services/notify';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import ErrorDisplay from '@/components/ErrorDisplay';
import { useTranslations } from 'next-intl';
import ListFooter from '@/components/ListFooter/ListFooter';
import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import SearchField from '@/components/SearchField/SearchField';
import useSearch from '@/hooks/useSearch';
import ListHeader from '@/components/ListHeader/ListHeader';

export default function Layout({ children }) {
	//

	//
	// A. Setup variables

	const router = useRouter();
	const t = useTranslations('municipalities');
	const [searchQuery, setSearchQuery] = useState('');
	const [isCreating, setIsCreating] = useState(false);

	//
	// B. Fetch data

	const { data: allMunicipalitiesData, error: allMunicipalitiesError, isLoading: allMunicipalitiesLoading, isValidating: allMunicipalitiesValidating, mutate: allMunicipalitiesMutate } = useSWR('/api/municipalities');

	//
	// C. Search

	const filteredMunicipalitiesData = useSearch(searchQuery, allMunicipalitiesData, { keys: ['name', 'code'] });

	//
	// D. Handle actions

	const handleCreate = async () => {
		try {
			setIsCreating(true);
			notify('new', 'loading', t('operations.create.loading'));
			const response = await API({ service: 'municipalities', operation: 'create', method: 'GET' });
			allMunicipalitiesMutate();
			router.push(`/municipalities/${response._id}`);
			notify('new', 'success', t('operations.create.success'));
			setIsCreating(false);
		} catch (error) {
			notify('new', 'error', error.message || t('operations.create.error'));
			setIsCreating(false);
			console.log(error);
		}
	};

	const exportAsFile = async () => {
		try {
			setIsCreating(true);
			const responseBlob = await API({ service: 'municipalities', operation: 'export/default', method: 'GET', parseType: 'blob' });
			const objectURL = URL.createObjectURL(responseBlob);
			// eslint-disable-next-line no-undef
			const htmlAnchorElement = document.createElement('a');
			htmlAnchorElement.href = objectURL;
			htmlAnchorElement.download = 'municipalities.txt';
			// eslint-disable-next-line no-undef
			document.body.appendChild(htmlAnchorElement);
			htmlAnchorElement.click();
			setIsCreating(false);
		} catch (error) {
			console.log(error);
			setIsCreating(false);
		}
	};

	//
	// D. Render data

	return (
		<AppAuthenticationCheck permissions={[{ scope: 'municipalities', action: 'navigate' }]} redirect>
			<TwoUnevenColumns
				first={
					<Pannel
						loading={allMunicipalitiesLoading}
						header={
							<ListHeader>
								<SearchField query={searchQuery} onChange={setSearchQuery} />
								<Menu shadow="md" position="bottom-end">
									<Menu.Target>
										<ActionIcon variant="light" size="lg" color="gray" loading={allMunicipalitiesLoading || isCreating}>
											<IconDots size={20} />
										</ActionIcon>
									</Menu.Target>
									<Menu.Dropdown>
										<AppAuthenticationCheck permissions={[{ scope: 'municipalities', action: 'create' }]}>
											<Menu.Item leftSection={<IconCirclePlus size={20} />} onClick={handleCreate}>
												{t('operations.create.title')}
											</Menu.Item>
										</AppAuthenticationCheck>
										<AppAuthenticationCheck permissions={[{ scope: 'configs', action: 'admin' }]}>
											<Menu.Item leftSection={<IconFileDownload size={20} />} onClick={exportAsFile}>
												{t('operations.export.title')}
											</Menu.Item>
										</AppAuthenticationCheck>
									</Menu.Dropdown>
								</Menu>
							</ListHeader>
						}
						footer={filteredMunicipalitiesData && <ListFooter>{t('list.footer', { count: filteredMunicipalitiesData.length })}</ListFooter>}
					>
						<ErrorDisplay error={allMunicipalitiesError} loading={allMunicipalitiesValidating} />
						{filteredMunicipalitiesData && filteredMunicipalitiesData.length > 0 ? filteredMunicipalitiesData.map((item) => <ListItem key={item._id} _id={item._id} code={item.code} name={item.name} district={item.district} region={item.region} />) : <NoDataLabel />}
					</Pannel>
				}
				second={children}
			/>
		</AppAuthenticationCheck>
	);
}