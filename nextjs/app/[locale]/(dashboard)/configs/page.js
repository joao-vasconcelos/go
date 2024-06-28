'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import Pannel from '@/components/Pannel/Pannel';
import Text from '@/components/Text/Text';
import API from '@/services/API';
import notify from '@/services/notify';
import { Button, Divider, Flex, Progress, RingProgress, SimpleGrid, Table, Tooltip } from '@mantine/core';
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

	console.log('slaProgressData', slaProgressData);

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

	const handleMarkStuckTripsAsPending = async () => {
		openConfirmModal({
			centered: true,
			children: <Text size="h3">Are you sure?</Text>,
			closeOnClickOutside: true,
			confirmProps: { color: 'red' },
			labels: { cancel: 'Cancel', confirm: 'Yes, Mark Stuck Trips as Pending' },
			onConfirm: async () => {
				try {
					setIsImporting(true);
					notify('markStuckTripsAsPending', 'loading', 'Loading');
					await API({ method: 'GET', service: 'configs/sla/markStuckTripsAsPending' });
					notify('markStuckTripsAsPending', 'success', 'success');
					setIsImporting(false);
				}
				catch (error) {
					console.log(error);
					notify('markStuckTripsAsPending', 'error', error.message || 'Error');
					setIsImporting(false);
				}
			},
			title: <Text size="h2">Mark Stuck Trips as Pending?</Text>,
		});
	};

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
					<Table
						data={{
							body: [[`${slaProgressData?.total || 0} Trips`, `${slaProgressData?.processed || 0} (${slaProgressData?.processed_percentage || 0}%)`, `${slaProgressData?.processing || 0} (${slaProgressData?.processing_percentage || 0}%)`, `${slaProgressData?.error || 0} (${slaProgressData?.error_percentage || 0}%)`, `${slaProgressData?.pending || 0} (${slaProgressData?.pending_percentage || 0}%)`]],
							head: ['Total', 'processed', 'processing', 'error', 'pending'] }}
						withTableBorder
					/>
					<Progress.Root size={30}>
						<Progress.Section color="green" value={slaProgressData?.processed_percentage || 0}>
							<Progress.Label>{`${slaProgressData?.processed || 0} processed (${slaProgressData?.processed_percentage || 0}%)`}</Progress.Label>
						</Progress.Section>
						<Progress.Section color="yellow" value={slaProgressData?.processing_percentage || 0}>
							<Progress.Label>{`${slaProgressData?.processing || 0} processing (${slaProgressData?.processing_percentage || 0}%)`}</Progress.Label>
						</Progress.Section>
						<Progress.Section color="red" value={slaProgressData?.error_percentage || 0}>
							<Progress.Label>{`${slaProgressData?.error || 0} error (${slaProgressData?.error_percentage || 0}%)`}</Progress.Label>
						</Progress.Section>
						<Progress.Section color="blue" value={slaProgressData?.pending_percentage || 0} animated>
							<Progress.Label>{`${slaProgressData?.pending || 0} pending (${slaProgressData?.pending_percentage || 0}%)`}</Progress.Label>
						</Progress.Section>
					</Progress.Root>
				</AppLayoutSection>

				<Divider />

				<AppLayoutSection>

					<SimpleGrid cols={3}>
						<Button color="blue" loading={isImporting} onClick={handleMarkStuckTripsAsPending}>
							Mark Stuck Trips as Pending
						</Button>
						<Button color="orange" loading={isImporting} onClick={handleMarkAllTripsAsPendingAnalysis}>
							Mark All Trips as Pending Analysis
						</Button>
						<Button color="red" loading={isImporting} onClick={handleMarkAllArchivesAsPendingParse}>
							Mark All Archives as Pending Parse
						</Button>
					</SimpleGrid>
				</AppLayoutSection>

			</Pannel>
		</AppAuthenticationCheck>
	);

	//
}
