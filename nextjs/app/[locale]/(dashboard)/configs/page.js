'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import Pannel from '@/components/Pannel/Pannel';
import Text from '@/components/Text/Text';
import API from '@/services/API';
import notify from '@/services/notify';
import { Button, Divider, Progress, SimpleGrid } from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import { useState } from 'react';
import useSWR from 'swr';

/* * */

export default function Page() {
	//

	//
	// A. Setup variables

	const [isImporting, setIsImporting] = useState(false);

	//
	// B. Fetch data

	const { data: slaProgressData } = useSWR('/api/reports/sla/progress', { refreshInterval: 1000 });

	//
	// C. Handle actiona

	// const handleImportNewStopNames = async () => {
	// 	openConfirmModal({
	// 		centered: true,
	// 		children: <Text size="h3">Are you sure?</Text>,
	// 		closeOnClickOutside: true,
	// 		confirmProps: { color: 'red' },
	// 		labels: { cancel: 'Cancel', confirm: 'Yes, Import New Stop Names' },
	// 		onConfirm: async () => {
	// 			try {
	// 				setIsImporting(true);
	// 				notify('importNewStopNames', 'loading', 'Loading');
	// 				await API({ method: 'GET', service: 'configs/imports/stops/new_stop_names' });
	// 				notify('importNewStopNames', 'success', 'success');
	// 				setIsImporting(false);
	// 			}
	// 			catch (error) {
	// 				console.log(error);
	// 				notify('importNewStopNames', 'error', error.message || 'Error');
	// 				setIsImporting(false);
	// 			}
	// 		},
	// 		title: <Text size="h2">Import New Stop Names?</Text>,
	// 	});
	// };

	const handleMarkAllTripsAsPendingAnalysis = async () => {
		openConfirmModal({
			centered: true,
			children: <Text size="h3">Are you sure?</Text>,
			closeOnClickOutside: true,
			confirmProps: { color: 'red' },
			labels: { cancel: 'Cancel', confirm: 'Yes, Mark All Trips As Pending Analysis' },
			onConfirm: async () => {
				try {
					setIsImporting(true);
					notify('markAllTripsAsPendingAnalysis', 'loading', 'Loading');
					await API({ method: 'GET', service: 'configs/sla/markAllTripsAsPendingAnalysis' });
					notify('markAllTripsAsPendingAnalysis', 'success', 'success');
					setIsImporting(false);
				}
				catch (error) {
					console.log(error);
					notify('markAllTripsAsPendingAnalysis', 'error', error.message || 'Error');
					setIsImporting(false);
				}
			},
			title: <Text size="h2">Mark All Trips As Pending Analysis?</Text>,
		});
	};

	const handleMarkAllArchivesAsPendingParse = async () => {
		openConfirmModal({
			centered: true,
			children: <Text size="h3">Are you sure?</Text>,
			closeOnClickOutside: true,
			confirmProps: { color: 'red' },
			labels: { cancel: 'Cancel', confirm: 'Yes, Mark All Archives As Pending Parse' },
			onConfirm: async () => {
				try {
					setIsImporting(true);
					notify('markAllArchivesAsPendingParse', 'loading', 'Loading');
					await API({ method: 'GET', service: 'configs/sla/markAllArchivesAsPendingParse' });
					notify('markAllArchivesAsPendingParse', 'success', 'success');
					setIsImporting(false);
				}
				catch (error) {
					console.log(error);
					notify('markAllArchivesAsPendingParse', 'error', error.message || 'Error');
					setIsImporting(false);
				}
			},
			title: <Text size="h2">Mark All Archives As Pending Parse?</Text>,
		});
	};

	//
	// C. Render components

	return (
		<AppAuthenticationCheck permissions={[{ action: 'admin', scope: 'configs' }]} redirect>
			<Pannel>
				<AppLayoutSection title="Offer Manager Advanced Operations">
					<NoDataLabel text="No operations available" />
					{/* <SimpleGrid cols={3}>
						<Button color="red" loading={isImporting} onClick={handleImportNewStopNames}>
							Import New Stop Names
						</Button>
					</SimpleGrid> */}
				</AppLayoutSection>

				<Divider />

				<AppLayoutSection title="SLA Manager Advanced Operations">
					<Progress value={slaProgressData?._progress || 0} animated />
					<SimpleGrid cols={3}>
						<Button color="red" loading={isImporting} onClick={handleMarkAllTripsAsPendingAnalysis}>
							Mark all Trips as Pending Analysis
						</Button>
						<Button color="red" loading={isImporting} onClick={handleMarkAllArchivesAsPendingParse}>
							Mark all Archives as Pending Parse
						</Button>
					</SimpleGrid>
				</AppLayoutSection>

			</Pannel>
		</AppAuthenticationCheck>
	);

	//
}
