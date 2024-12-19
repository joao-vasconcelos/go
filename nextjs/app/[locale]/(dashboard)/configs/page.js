'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import Pannel from '@/components/Pannel/Pannel';
import Text from '@/components/Text/Text';
import API from '@/services/API';
import notify from '@/services/notify';
import { Button, Divider, Loader, Progress, SimpleGrid, Table } from '@mantine/core';
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

	const { data: slaProgressSummaryData, mutate: slaProgressSummaryMutate } = useSWR('/api/sla/progress/summary', { refreshInterval: 10000 });
	const { data: slaProgressByDayData, isLoading: slaProgressByDayLoading, mutate: slaProgressByDayMutate } = useSWR('/api/sla/progress/breakdown-by-operational-date', { refreshInterval: 10000 });

	//
	// C. Handle actions

	const handleMarkAllRidesAsPending = async () => {
		openConfirmModal({
			centered: true,
			children: <Text size="h3">Are you sure?</Text>,
			closeOnClickOutside: true,
			confirmProps: { color: 'red' },
			labels: { cancel: 'Cancel', confirm: 'Yes, Mark All Rides As Pending Analysis' },
			onConfirm: async () => {
				try {
					setIsImporting(true);
					notify('mark-all-rides-as-pending', 'loading', 'Loading');
					await API({ method: 'GET', service: 'sla/operations/mark-all-rides-as-pending' });
					slaProgressSummaryMutate();
					slaProgressByDayMutate();
					notify('mark-all-rides-as-pending', 'success', 'success');
					setIsImporting(false);
				}
				catch (error) {
					console.log(error);
					notify('mark-all-rides-as-pending', 'error', error.message || 'Error');
					setIsImporting(false);
				}
			},
			title: <Text size="h2">Mark All Rides As Pending Analysis?</Text>,
		});
	};

	const handleMarkProcessingRidesAsPending = async () => {
		openConfirmModal({
			centered: true,
			children: <Text size="h3">Are you sure?</Text>,
			closeOnClickOutside: true,
			confirmProps: { color: 'red' },
			labels: { cancel: 'Cancel', confirm: 'Yes, Mark Processing Rides As Pending Analysis' },
			onConfirm: async () => {
				try {
					setIsImporting(true);
					notify('mark-processing-rides-as-pending', 'loading', 'Loading');
					await API({ method: 'GET', service: 'sla/operations/mark-processing-rides-as-pending' });
					slaProgressSummaryMutate();
					slaProgressByDayMutate();
					notify('mark-processing-rides-as-pending', 'success', 'success');
					setIsImporting(false);
				}
				catch (error) {
					console.log(error);
					notify('mark-processing-rides-as-pending', 'error', error.message || 'Error');
					setIsImporting(false);
				}
			},
			title: <Text size="h2">Mark Processing Rides As Pending Analysis?</Text>,
		});
	};

	const handleMarkErrorRidesAsPending = async () => {
		openConfirmModal({
			centered: true,
			children: <Text size="h3">Are you sure?</Text>,
			closeOnClickOutside: true,
			confirmProps: { color: 'red' },
			labels: { cancel: 'Cancel', confirm: 'Yes, Mark Error Rides As Pending Analysis' },
			onConfirm: async () => {
				try {
					setIsImporting(true);
					notify('mark-error-rides-as-pending', 'loading', 'Loading');
					await API({ method: 'GET', service: 'sla/operations/mark-error-rides-as-pending' });
					slaProgressSummaryMutate();
					slaProgressByDayMutate();
					notify('mark-error-rides-as-pending', 'success', 'success');
					setIsImporting(false);
				}
				catch (error) {
					console.log(error);
					notify('mark-error-rides-as-pending', 'error', error.message || 'Error');
					setIsImporting(false);
				}
			},
			title: <Text size="h2">Mark Error Rides As Pending Analysis?</Text>,
		});
	};

	const handleDeleteAllRides = async () => {
		openConfirmModal({
			centered: true,
			children: <Text size="h3">Are you sure?</Text>,
			closeOnClickOutside: true,
			confirmProps: { color: 'red' },
			labels: { cancel: 'Cancel', confirm: 'Yes, Delete All Rides' },
			onConfirm: async () => {
				try {
					setIsImporting(true);
					notify('delete-all-rides', 'loading', 'Loading');
					await API({ method: 'GET', service: 'sla/operations/delete-all-rides' });
					slaProgressSummaryMutate();
					slaProgressByDayMutate();
					notify('delete-all-rides', 'success', 'success');
					setIsImporting(false);
				}
				catch (error) {
					console.log(error);
					notify('delete-all-rides', 'error', error.message || 'Error');
					setIsImporting(false);
				}
			},
			title: <Text size="h2">Delete All Rides?</Text>,
		});
	};

	const handleReprocessRides = async (operationalDate) => {
		openConfirmModal({
			centered: true,
			children: <Text size="h3">Are you sure?</Text>,
			closeOnClickOutside: true,
			confirmProps: { color: 'red' },
			labels: { cancel: 'Cancel', confirm: `Yes, Reprocess Rides for Operational Date ${operationalDate}` },
			onConfirm: async () => {
				try {
					setIsImporting(true);
					notify(`reprocess-rides-${operationalDate}`, 'loading', `Reprocessing Rides for Operational Date ${operationalDate}`);
					await API({ method: 'GET', service: `sla/operations/${operationalDate}/reprocess-rides` });
					slaProgressSummaryMutate();
					slaProgressByDayMutate();
					notify(`reprocess-rides-${operationalDate}`, 'success', 'success');
					setIsImporting(false);
				}
				catch (error) {
					console.log(error);
					notify(`reprocess-rides-${operationalDate}`, 'error', error.message || 'Error');
					setIsImporting(false);
				}
			},
			title: <Text size="h2">Reprocess Rides for Operational Date {operationalDate}?</Text>,
		});
	};

	//
	// C. Transform data

	const progressByDayTableData = useMemo(() => {
		if (!slaProgressByDayData) return null;
		const body = slaProgressByDayData
			.map(item => [
				item.operational_date || '-',
				item.total || 0,
				`${item.complete || 0} (${item.complete_percentage || 0}%)`,
				`${item.processing || 0} (${item.processing_percentage || 0}%)`,
				`${item.error || 0} (${item.error_percentage || 0}%)`,
				`${item.pending || 0} (${item.pending_percentage || 0}%)`,
				<Button loading={isImporting} onClick={() => handleReprocessRides(item.operational_date)} size="xs">Reprocess Rides</Button>,
			])
			.sort((a, b) => a[0].localeCompare(b[0]));
		const head = ['operational_date', 'total', 'complete', 'processing', 'error', 'pending', 'operations'];
		return { body, head };
	}, [slaProgressByDayData]);

	//
	// D. Render components

	return (
		<AppAuthenticationCheck permissions={[{ action: 'admin', scope: 'configs' }]} redirect>
			<Pannel>

				<AppLayoutSection title="SLA Manager Advanced Operations">
					<Table
						data={{
							body: [[`${slaProgressSummaryData?.total || 0} Trips`, `${slaProgressSummaryData?.complete || 0} (${slaProgressSummaryData?.complete_percentage || 0}%)`, `${slaProgressSummaryData?.processing || 0} (${slaProgressSummaryData?.processing_percentage || 0}%)`, `${slaProgressSummaryData?.error || 0} (${slaProgressSummaryData?.error_percentage || 0}%)`, `${slaProgressSummaryData?.pending || 0} (${slaProgressSummaryData?.pending_percentage || 0}%)`]],
							head: ['Total', 'complete', 'processing', 'error', 'pending'] }}
						withTableBorder
					/>
					<Progress.Root size={30}>
						<Progress.Section color="green" value={slaProgressSummaryData?.complete_percentage || 0}>
							<Progress.Label>{`${slaProgressSummaryData?.complete || 0} complete (${slaProgressSummaryData?.complete_percentage || 0}%)`}</Progress.Label>
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
				</AppLayoutSection>

				<Divider />

				<AppLayoutSection>

					<SimpleGrid cols={4}>
						<Button color="teal" loading={isImporting} onClick={handleMarkErrorRidesAsPending}>
							Mark Error Rides as Pending
						</Button>
						<Button color="blue" loading={isImporting} onClick={handleMarkProcessingRidesAsPending}>
							Mark Processing Rides as Pending
						</Button>
						<Button color="red" loading={isImporting} onClick={handleMarkAllRidesAsPending}>
							Mark All Rides as Pending
						</Button>
						<Button color="black" loading={isImporting} onClick={handleDeleteAllRides}>
							Delete All Rides
						</Button>
					</SimpleGrid>
				</AppLayoutSection>

				<Divider />

				<AppLayoutSection>
					{slaProgressByDayLoading ? <Loader /> : <Table data={progressByDayTableData} highlightOnHover withTableBorder />}
				</AppLayoutSection>

			</Pannel>
		</AppAuthenticationCheck>
	);

	//
}
