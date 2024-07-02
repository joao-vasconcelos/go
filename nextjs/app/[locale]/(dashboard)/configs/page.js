'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import Pannel from '@/components/Pannel/Pannel';
import Text from '@/components/Text/Text';
import API from '@/services/API';
import notify from '@/services/notify';
import { Button, Divider, Progress, SimpleGrid, Table } from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import { useMemo, useState } from 'react';
import useSWR from 'swr';

/* * */

export default function Page() {
	//

	//
	// A. Setup variables

	const [isImporting, setIsImporting] = useState(false);

	//
	// B. Fetch data

	const { data: slaProgressSummaryData } = useSWR('/api/sla/progress/summary', { refreshInterval: 1000 });
	const { data: slaProgressByDayData } = useSWR('/api/sla/progress/breakdown_by_operational_day', { refreshInterval: 1000 });

	//
	// C. Handle actiona

	// const handleStandardizeCalendars = async () => {
	// 	openConfirmModal({
	// 		centered: true,
	// 		children: <Text size="h3">Are you sure?</Text>,
	// 		closeOnClickOutside: true,
	// 		confirmProps: { color: 'red' },
	// 		labels: { cancel: 'Cancel', confirm: 'Yes, Standardize Calendars' },
	// 		onConfirm: async () => {
	// 			try {
	// 				setIsImporting(true);
	// 				notify('standardizeCalendars', 'loading', 'Loading');
	// 				await API({ method: 'GET', service: 'configs/refactors/standardizeCalendars' });
	// 				notify('standardizeCalendars', 'success', 'success');
	// 				setIsImporting(false);
	// 			}
	// 			catch (error) {
	// 				console.log(error);
	// 				notify('standardizeCalendars', 'error', error.message || 'Error');
	// 				setIsImporting(false);
	// 			}
	// 		},
	// 		title: <Text size="h2">Standardize Calendars?</Text>,
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
					await API({ method: 'GET', service: 'sla/operations/markStuckTripsAsPending' });
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
					await API({ method: 'GET', service: 'sla/operations/markAllTripsAsPendingAnalysis' });
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
					await API({ method: 'GET', service: 'sla/operations/markAllArchivesAsPendingParse' });
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
	// C. Transform data

	const progressByDayTableData = useMemo(() => {
		if (!slaProgressByDayData) return null;
		const body = slaProgressByDayData
			.map(item => [item.operational_day || '-', item.total || 0, `${item.processed || 0} (${item.processed_percentage || 0}%)`, `${item.processing || 0} (${item.processing_percentage || 0}%)`, `${item.error || 0} (${item.error_percentage || 0}%)`, `${item.pending || 0} (${item.pending_percentage || 0}%)`])
			.sort((a, b) => a[0] - b[0]);
		const head = ['operational_day', 'total', 'processed', 'processing', 'error', 'pending'];
		return { body, head };
	}, [slaProgressByDayData]);

	//
	// D. Render components

	return (
		<AppAuthenticationCheck permissions={[{ action: 'admin', scope: 'configs' }]} redirect>
			<Pannel>
				<AppLayoutSection title="Offer Manager Advanced Operations">
					<NoDataLabel text="No operations available" />
					{/* <SimpleGrid cols={3}>
						<Button color="red" loading={isImporting} onClick={handleStandardizeCalendars}>
							Standardize Calendars
						</Button>
					</SimpleGrid> */}
				</AppLayoutSection>

				<Divider />

				<AppLayoutSection title="SLA Manager Advanced Operations">
					<Table
						data={{
							body: [[`${slaProgressSummaryData?.total || 0} Trips`, `${slaProgressSummaryData?.processed || 0} (${slaProgressSummaryData?.processed_percentage || 0}%)`, `${slaProgressSummaryData?.processing || 0} (${slaProgressSummaryData?.processing_percentage || 0}%)`, `${slaProgressSummaryData?.error || 0} (${slaProgressSummaryData?.error_percentage || 0}%)`, `${slaProgressSummaryData?.pending || 0} (${slaProgressSummaryData?.pending_percentage || 0}%)`]],
							head: ['Total', 'processed', 'processing', 'error', 'pending'] }}
						withTableBorder
					/>
					<Progress.Root size={30}>
						<Progress.Section color="green" value={slaProgressSummaryData?.processed_percentage || 0}>
							<Progress.Label>{`${slaProgressSummaryData?.processed || 0} processed (${slaProgressSummaryData?.processed_percentage || 0}%)`}</Progress.Label>
						</Progress.Section>
						<Progress.Section color="yellow" value={slaProgressSummaryData?.processing_percentage || 0}>
							<Progress.Label>{`${slaProgressSummaryData?.processing || 0} processing (${slaProgressSummaryData?.processing_percentage || 0}%)`}</Progress.Label>
						</Progress.Section>
						<Progress.Section color="red" value={slaProgressSummaryData?.error_percentage || 0}>
							<Progress.Label>{`${slaProgressSummaryData?.error || 0} error (${slaProgressSummaryData?.error_percentage || 0}%)`}</Progress.Label>
						</Progress.Section>
						<Progress.Section color="blue" value={slaProgressSummaryData?.pending_percentage || 0} animated>
							<Progress.Label>{`${slaProgressSummaryData?.pending || 0} pending (${slaProgressSummaryData?.pending_percentage || 0}%)`}</Progress.Label>
						</Progress.Section>
					</Progress.Root>
					<Table data={progressByDayTableData} highlightOnHover withTableBorder />
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
