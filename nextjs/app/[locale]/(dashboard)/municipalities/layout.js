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
import { IconCirclePlus, IconDots, IconFileDownload } from '@tabler/icons-react';
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
			const response = await API({ method: 'GET', operation: 'create', service: 'municipalities' });
			allMunicipalitiesMutate();
			router.push(`/municipalities/${response._id}`);
			notify('new', 'success', t('operations.create.success'));
			setIsCreating(false);
		}
		catch (error) {
			notify('new', 'error', error.message || t('operations.create.error'));
			setIsCreating(false);
			console.log(error);
		}
	};

	const exportAsFile = async () => {
		try {
			setIsCreating(true);
			const responseBlob = await API({ method: 'GET', operation: 'export/default', parseType: 'blob', service: 'municipalities' });
			const objectURL = URL.createObjectURL(responseBlob);
			// eslint-disable-next-line no-undef
			const htmlAnchorElement = document.createElement('a');
			htmlAnchorElement.href = objectURL;
			htmlAnchorElement.download = 'municipalities.txt';
			// eslint-disable-next-line no-undef
			document.body.appendChild(htmlAnchorElement);
			htmlAnchorElement.click();
			setIsCreating(false);
		}
		catch (error) {
			console.log(error);
			setIsCreating(false);
		}
	};

	//
	// D. Render data

	return (
		<AppAuthenticationCheck permissions={[{ action: 'navigate', scope: 'municipalities' }]} redirect>
			<TwoUnevenColumns
				second={children}
				first={(
					<Pannel
						footer={filteredMunicipalitiesData && <ListFooter>{t('list.footer', { count: filteredMunicipalitiesData.length })}</ListFooter>}
						loading={allMunicipalitiesLoading}
						header={(
							<ListHeader>
								<SearchField onChange={setSearchQuery} query={searchQuery} />
								<Menu position="bottom-end" shadow="md">
									<Menu.Target>
										<ActionIcon color="gray" loading={allMunicipalitiesLoading || isCreating} size="lg" variant="light">
											<IconDots size={20} />
										</ActionIcon>
									</Menu.Target>
									<Menu.Dropdown>
										<AppAuthenticationCheck permissions={[{ action: 'create', scope: 'municipalities' }]}>
											<Menu.Item leftSection={<IconCirclePlus size={20} />} onClick={handleCreate}>
												{t('operations.create.title')}
											</Menu.Item>
										</AppAuthenticationCheck>
										<AppAuthenticationCheck permissions={[{ action: 'admin', scope: 'configs' }]}>
											<Menu.Item leftSection={<IconFileDownload size={20} />} onClick={exportAsFile}>
												{t('operations.export.title')}
											</Menu.Item>
										</AppAuthenticationCheck>
									</Menu.Dropdown>
								</Menu>
							</ListHeader>
						)}
					>
						<ErrorDisplay error={allMunicipalitiesError} loading={allMunicipalitiesValidating} />
						{filteredMunicipalitiesData && filteredMunicipalitiesData.length > 0 ? filteredMunicipalitiesData.map(item => <ListItem key={item._id} _id={item._id} code={item.code} district={item.district} name={item.name} region={item.region} />) : <NoDataLabel />}
					</Pannel>
				)}
			/>
		</AppAuthenticationCheck>
	);
}
