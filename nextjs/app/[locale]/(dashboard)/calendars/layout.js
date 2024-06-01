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
import { IconCirclePlus, IconDots, IconDownload } from '@tabler/icons-react';
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
	const t = useTranslations('calendars');
	const [searchQuery, setSearchQuery] = useState('');
	const [isCreating, setIsCreating] = useState(false);

	//
	// B. Fetch data

	const { data: allCalendarsData, error: allCalendarsError, isLoading: allCalendarsLoading, isValidating: allCalendarsValidating, mutate: allCalendarsMutate } = useSWR('/api/calendars');

	//
	// C. Search

	const filteredCalendarsData = useSearch(searchQuery, allCalendarsData, { keys: ['code', 'name'] });

	//
	// C. Handle actions

	const handleCreate = async () => {
		try {
			setIsCreating(true);
			notify('new', 'loading', t('operations.create.loading'));
			const response = await API({ method: 'GET', operation: 'create', service: 'calendars' });
			allCalendarsMutate();
			router.push(`/calendars/${response._id}`);
			notify('new', 'success', t('operations.create.success'));
			setIsCreating(false);
		}
		catch (error) {
			notify('new', 'error', error.message || t('operations.create.error'));
			setIsCreating(false);
			console.log(error);
		}
	};

	const handleExportDates = async () => {
		try {
			setIsCreating(true);
			notify('export_dates', 'loading', t('operations.export_dates.loading'));
			const responseBlob = await API({ method: 'GET', operation: 'export/dates', parseType: 'blob', service: 'calendars' });
			const objectURL = URL.createObjectURL(responseBlob);
			const htmlAnchorElement = document.createElement('a');
			htmlAnchorElement.href = objectURL;
			htmlAnchorElement.download = 'dates.txt';
			document.body.appendChild(htmlAnchorElement);
			htmlAnchorElement.click();
			notify('export_dates', 'success', t('operations.export_dates.success'));
			setIsCreating(false);
		}
		catch (error) {
			notify('export_dates', 'error', error.message || t('operations.export_dates.error'));
			setIsCreating(false);
			console.log(error);
		}
	};

	const handleExportPeriods = async () => {
		try {
			setIsCreating(true);
			notify('export_dates', 'loading', t('operations.export_periods.loading'));
			const responseBlob = await API({ method: 'GET', operation: 'export/periods', parseType: 'blob', service: 'calendars' });
			const objectURL = URL.createObjectURL(responseBlob);
			const htmlAnchorElement = document.createElement('a');
			htmlAnchorElement.href = objectURL;
			htmlAnchorElement.download = 'periods.txt';
			document.body.appendChild(htmlAnchorElement);
			htmlAnchorElement.click();
			notify('export_periods', 'success', t('operations.export_periods.success'));
			setIsCreating(false);
		}
		catch (error) {
			notify('export_periods', 'error', error.message || t('operations.export_periods.error'));
			setIsCreating(false);
			console.log(error);
		}
	};

	//
	// D. Render data

	return (
		<AppAuthenticationCheck permissions={[{ action: 'navigate', scope: 'calendars' }]} redirect>
			<TwoUnevenColumns
				second={children}
				first={(
					<Pannel
						footer={filteredCalendarsData && <ListFooter>{t('list.footer', { count: filteredCalendarsData.length })}</ListFooter>}
						loading={allCalendarsLoading}
						header={(
							<ListHeader>
								<SearchField onChange={setSearchQuery} query={searchQuery} />
								<Menu position="bottom-end" shadow="md">
									<Menu.Target>
										<ActionIcon color="gray" loading={allCalendarsLoading || isCreating} size="lg" variant="light">
											<IconDots size={20} />
										</ActionIcon>
									</Menu.Target>
									<Menu.Dropdown>
										<Menu.Item leftSection={<IconCirclePlus size={20} />} onClick={handleCreate}>
											{t('operations.create.title')}
										</Menu.Item>
										<AppAuthenticationCheck permissions={[{ action: 'export_dates', scope: 'calendars' }]}>
											<Menu.Item leftSection={<IconDownload size={20} />} onClick={handleExportDates}>
												{t('operations.export_dates.title')}
											</Menu.Item>
										</AppAuthenticationCheck>
										<AppAuthenticationCheck permissions={[{ action: 'export_dates', scope: 'calendars' }]}>
											<Menu.Item leftSection={<IconDownload size={20} />} onClick={handleExportPeriods}>
												{t('operations.export_periods.title')}
											</Menu.Item>
										</AppAuthenticationCheck>
									</Menu.Dropdown>
								</Menu>
							</ListHeader>
						)}
					>
						<ErrorDisplay error={allCalendarsError} loading={allCalendarsValidating} />
						{filteredCalendarsData && filteredCalendarsData.length > 0 ? filteredCalendarsData.map(item => <ListItem key={item._id} _id={item._id} code={item.code} name={item.name} />) : <NoDataLabel />}
					</Pannel>
				)}
			/>
		</AppAuthenticationCheck>
	);
}
