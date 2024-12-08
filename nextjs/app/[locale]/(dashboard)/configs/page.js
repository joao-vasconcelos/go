'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import { AppLayoutSection } from '@/components/AppLayoutSection/AppLayoutSection';
import Pannel from '@/components/Pannel/Pannel';
import Text from '@/components/Text/Text';
import API from '@/services/API';
import notify from '@/services/notify';
import { Button, Divider, Group, Loader, Progress, SimpleGrid, Table } from '@mantine/core';
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
	// const { data: slaProgressBufferDayData, mutate: slaProgressBufferDayMutate } = useSWR('/api/sla/progress/buffer_by_operational_date', { refreshInterval: 10000 });

	//
	// C. Handle actions

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
					slaProgressSummaryMutate();
					slaProgressByDayMutate();
					// slaProgressBufferDayMutate();
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
					// slaProgressBufferDayMutate();
					notify('mark-all-rides-as-pending', 'success', 'success');
					setIsImporting(false);
				}
				catch (error) {
					console.log(error);
					notify('mark-all-rides-as-pending', 'error', error.message || 'Error');
					setIsImporting(false);
				}
			},
			title: <Text size="h2">Mark All Trips As Pending Analysis?</Text>,
		});
	};

	const handleDeleteAllTripsAndMarkAllArchivesAdPendingParse = async () => {
		openConfirmModal({
			centered: true,
			children: <Text size="h3">Are you sure?</Text>,
			closeOnClickOutside: true,
			confirmProps: { color: 'red' },
			labels: { cancel: 'Cancel', confirm: 'Yes, Delete All Trips And Mark All Archives As Pending Parse' },
			onConfirm: async () => {
				try {
					setIsImporting(true);
					notify('deleteAllTripsAndMarkAllArchivesAsPendingParse', 'loading', 'Loading');
					await API({ method: 'GET', service: 'sla/operations/deleteAllTripsAndMarkAllArchivesAsPendingParse' });
					slaProgressSummaryMutate();
					slaProgressByDayMutate();
					// slaProgressBufferDayMutate();
					notify('deleteAllTripsAndMarkAllArchivesAsPendingParse', 'success', 'success');
					setIsImporting(false);
				}
				catch (error) {
					console.log(error);
					notify('deleteAllTripsAndMarkAllArchivesAsPendingParse', 'error', error.message || 'Error');
					setIsImporting(false);
				}
			},
			title: <Text size="h2">Delete All Trips And Mark All Archives As Pending Parse?</Text>,
		});
	};

	const handleDeleteBufferDataVehicleEvents = async () => {
		openConfirmModal({
			centered: true,
			children: <Text size="h3">Are you sure?</Text>,
			closeOnClickOutside: true,
			confirmProps: { color: 'red' },
			labels: { cancel: 'Cancel', confirm: 'Yes, Delete Buffer Data Vehicle Events' },
			onConfirm: async () => {
				try {
					setIsImporting(true);
					notify('deleteBufferDataVehicleEvents', 'loading', 'Loading');
					await API({ method: 'GET', service: 'sla/operations/deleteBufferDataVehicleEvents' });
					slaProgressSummaryMutate();
					slaProgressByDayMutate();
					// slaProgressBufferDayMutate();
					notify('deleteBufferDataVehicleEvents', 'success', 'success');
					setIsImporting(false);
				}
				catch (error) {
					console.log(error);
					notify('deleteBufferDataVehicleEvents', 'error', error.message || 'Error');
					setIsImporting(false);
				}
			},
			title: <Text size="h2">Delete Buffer Data Vehicle Events?</Text>,
		});
	};

	const handleDeleteBufferDataValidationTransactions = async () => {
		openConfirmModal({
			centered: true,
			children: <Text size="h3">Are you sure?</Text>,
			closeOnClickOutside: true,
			confirmProps: { color: 'red' },
			labels: { cancel: 'Cancel', confirm: 'Yes, Delete Buffer Data Validation Transactions' },
			onConfirm: async () => {
				try {
					setIsImporting(true);
					notify('deleteBufferDataValidationTransactions', 'loading', 'Loading');
					await API({ method: 'GET', service: 'sla/operations/deleteBufferDataValidationTransactions' });
					slaProgressSummaryMutate();
					slaProgressByDayMutate();
					// slaProgressBufferDayMutate();
					notify('deleteBufferDataValidationTransactions', 'success', 'success');
					setIsImporting(false);
				}
				catch (error) {
					console.log(error);
					notify('deleteBufferDataValidationTransactions', 'error', error.message || 'Error');
					setIsImporting(false);
				}
			},
			title: <Text size="h2">Delete Buffer Data Validation Transactions?</Text>,
		});
	};

	const handleDeleteBufferDataLocationTransactions = async () => {
		openConfirmModal({
			centered: true,
			children: <Text size="h3">Are you sure?</Text>,
			closeOnClickOutside: true,
			confirmProps: { color: 'red' },
			labels: { cancel: 'Cancel', confirm: 'Yes, Delete Buffer Data Location Transactions' },
			onConfirm: async () => {
				try {
					setIsImporting(true);
					notify('deleteBufferDataLocationTransactions', 'loading', 'Loading');
					await API({ method: 'GET', service: 'sla/operations/deleteBufferDataLocationTransactions' });
					slaProgressSummaryMutate();
					slaProgressByDayMutate();
					// slaProgressBufferDayMutate();
					notify('deleteBufferDataLocationTransactions', 'success', 'success');
					setIsImporting(false);
				}
				catch (error) {
					console.log(error);
					notify('deleteBufferDataLocationTransactions', 'error', error.message || 'Error');
					setIsImporting(false);
				}
			},
			title: <Text size="h2">Delete Buffer Data Location Transactions?</Text>,
		});
	};

	const handleReprocessTrips = async (operationalDay) => {
		openConfirmModal({
			centered: true,
			children: <Text size="h3">Are you sure?</Text>,
			closeOnClickOutside: true,
			confirmProps: { color: 'red' },
			labels: { cancel: 'Cancel', confirm: `Yes, Reprocess Trips for Operational Day ${operationalDay}` },
			onConfirm: async () => {
				try {
					setIsImporting(true);
					notify(`reprocessTrips-${operationalDay}`, 'loading', `Reprocessing Trips for Operational Day ${operationalDay}`);
					await API({ method: 'GET', service: `sla/operations/${operationalDay}/reprocessTrips` });
					slaProgressSummaryMutate();
					slaProgressByDayMutate();
					// slaProgressBufferDayMutate();
					notify(`reprocessTrips-${operationalDay}`, 'success', 'success');
					setIsImporting(false);
				}
				catch (error) {
					console.log(error);
					notify(`reprocessTrips-${operationalDay}`, 'error', error.message || 'Error');
					setIsImporting(false);
				}
			},
			title: <Text size="h2">Reprocess Trips for Operational Day {operationalDay}?</Text>,
		});
	};

	// const handleReprocessDay = async (operationalDay) => {
	// 	openConfirmModal({
	// 		centered: true,
	// 		children: <Text size="h3">Are you sure?</Text>,
	// 		closeOnClickOutside: true,
	// 		confirmProps: { color: 'red' },
	// 		labels: { cancel: 'Cancel', confirm: `Yes, Reprocess Operational Day ${operationalDay}` },
	// 		onConfirm: async () => {
	// 			try {
	// 				setIsImporting(true);
	// 				notify(`reprocessDay-${operationalDay}`, 'loading', `Reprocessing Operational Day ${operationalDay}`);
	// 				await API({ method: 'GET', service: `sla/operations/${operationalDay}/reprocessDay` });
	// 				slaProgressSummaryMutate();
	// 				slaProgressByDayMutate();
	// 				// slaProgressBufferDayMutate();
	// 				notify(`reprocessDay-${operationalDay}`, 'success', 'success');
	// 				setIsImporting(false);
	// 			}
	// 			catch (error) {
	// 				console.log(error);
	// 				notify(`reprocessDay-${operationalDay}`, 'error', error.message || 'Error');
	// 				setIsImporting(false);
	// 			}
	// 		},
	// 		title: <Text size="h2">Reprocess BufferData Operational Day {operationalDay}?</Text>,
	// 	});
	// };

	// const handleDeleteDayBufferDataVehicleEvents = async (operationalDay) => {
	// 	openConfirmModal({
	// 		centered: true,
	// 		children: <Text size="h3">Are you sure?</Text>,
	// 		closeOnClickOutside: true,
	// 		confirmProps: { color: 'red' },
	// 		labels: { cancel: 'Cancel', confirm: `Yes, Delete Day BufferData VehicleEvents for ${operationalDay}` },
	// 		onConfirm: async () => {
	// 			try {
	// 				setIsImporting(true);
	// 				notify(`deleteDayBufferDataVehicleEvents-${operationalDay}`, 'loading', `Delete Day BufferData VehicleEvents for ${operationalDay}`);
	// 				await API({ method: 'GET', service: `sla/operations/${operationalDay}/deleteDayBufferDataVehicleEvents` });
	// 				slaProgressSummaryMutate();
	// 				slaProgressByDayMutate();
	// 				// slaProgressBufferDayMutate();
	// 				notify(`deleteDayBufferDataVehicleEvents-${operationalDay}`, 'success', 'success');
	// 				setIsImporting(false);
	// 			}
	// 			catch (error) {
	// 				console.log(error);
	// 				notify(`deleteDayBufferDataVehicleEvents-${operationalDay}`, 'error', error.message || 'Error');
	// 				setIsImporting(false);
	// 			}
	// 		},
	// 		title: <Text size="h2">Delete Day BufferData VehicleEvents for {operationalDay}?</Text>,
	// 	});
	// };

	// const handleDeleteDayBufferDataValidationTransactions = async (operationalDay) => {
	// 	openConfirmModal({
	// 		centered: true,
	// 		children: <Text size="h3">Are you sure?</Text>,
	// 		closeOnClickOutside: true,
	// 		confirmProps: { color: 'red' },
	// 		labels: { cancel: 'Cancel', confirm: `Yes, Delete Day BufferData ValidationTransactions for ${operationalDay}` },
	// 		onConfirm: async () => {
	// 			try {
	// 				setIsImporting(true);
	// 				notify(`deleteDayBufferDataValidationTransactions-${operationalDay}`, 'loading', `Delete Day BufferData ValidationTransactions for ${operationalDay}`);
	// 				await API({ method: 'GET', service: `sla/operations/${operationalDay}/deleteDayBufferDataValidationTransactions` });
	// 				slaProgressSummaryMutate();
	// 				slaProgressByDayMutate();
	// 				// slaProgressBufferDayMutate();
	// 				notify(`deleteDayBufferDataValidationTransactions-${operationalDay}`, 'success', 'success');
	// 				setIsImporting(false);
	// 			}
	// 			catch (error) {
	// 				console.log(error);
	// 				notify(`deleteDayBufferDataValidationTransactions-${operationalDay}`, 'error', error.message || 'Error');
	// 				setIsImporting(false);
	// 			}
	// 		},
	// 		title: <Text size="h2">Delete Day BufferData ValidationTransactions for {operationalDay}?</Text>,
	// 	});
	// };

	// const handleDeleteDayBufferDataLocationTransactions = async (operationalDay) => {
	// 	openConfirmModal({
	// 		centered: true,
	// 		children: <Text size="h3">Are you sure?</Text>,
	// 		closeOnClickOutside: true,
	// 		confirmProps: { color: 'red' },
	// 		labels: { cancel: 'Cancel', confirm: `Yes, Delete Day BufferData LocationTransactions for ${operationalDay}` },
	// 		onConfirm: async () => {
	// 			try {
	// 				setIsImporting(true);
	// 				notify(`deleteDayBufferDataLocationTransactions-${operationalDay}`, 'loading', `Delete Day BufferData LocationTransactions for ${operationalDay}`);
	// 				await API({ method: 'GET', service: `sla/operations/${operationalDay}/deleteDayBufferDataLocationTransactions` });
	// 				slaProgressSummaryMutate();
	// 				slaProgressByDayMutate();
	// 				// slaProgressBufferDayMutate();
	// 				notify(`deleteDayBufferDataLocationTransactions-${operationalDay}`, 'success', 'success');
	// 				setIsImporting(false);
	// 			}
	// 			catch (error) {
	// 				console.log(error);
	// 				notify(`deleteDayBufferDataLocationTransactions-${operationalDay}`, 'error', error.message || 'Error');
	// 				setIsImporting(false);
	// 			}
	// 		},
	// 		title: <Text size="h2">Delete Day BufferData LocationTransactions for {operationalDay}?</Text>,
	// 	});
	// };

	const handleDeleteDayTrips = async (operationalDay) => {
		openConfirmModal({
			centered: true,
			children: <Text size="h3">Are you sure?</Text>,
			closeOnClickOutside: true,
			confirmProps: { color: 'red' },
			labels: { cancel: 'Cancel', confirm: `DANGER! Delete Day Trips for ${operationalDay}` },
			onConfirm: async () => {
				try {
					setIsImporting(true);
					notify(`_danger_deleteDayTrips-${operationalDay}`, 'loading', 'Loading');
					await API({ method: 'GET', service: `sla/operations/${operationalDay}/_danger_deleteDayTrips` });
					slaProgressSummaryMutate();
					slaProgressByDayMutate();
					// slaProgressBufferDayMutate();
					notify(`_danger_deleteDayTrips-${operationalDay}`, 'success', 'success');
					setIsImporting(false);
				}
				catch (error) {
					console.log(error);
					notify(`_danger_deleteDayTrips-${operationalDay}`, 'error', error.message || 'Error');
					setIsImporting(false);
				}
			},
			title: <Text size="h2">DANGER! Delete Day Trips for {operationalDay}?</Text>,
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
				<Group>
					<Button loading={isImporting} onClick={() => handleReprocessTrips(item.operational_date)} size="xs">Reprocess Trips</Button>
					<Button color="black" loading={isImporting} onClick={() => handleDeleteDayTrips(item.operational_date)} size="xs">Delete Day Trips</Button>
				</Group>,
			])
			.sort((a, b) => a[0].localeCompare(b[0]));
		const head = ['operational_date', 'total', 'complete', 'processing', 'error', 'pending', 'slamanagerdb operations'];
		return { body, head };
	}, [slaProgressByDayData]);

	// const progressBufferDaysTableData = useMemo(() => {
	// 	if (!slaProgressBufferDayData) return null;
	// 	const body = slaProgressBufferDayData
	// 		.map(item => [
	// 			item.operational_date || '-',
	// 			item.vehicle_event_synced ? <span style={{ color: 'green' }}>true</span> : <span style={{ color: 'red' }}>false</span>,
	// 			item.validation_transaction_synced ? <span style={{ color: 'green' }}>true</span> : <span style={{ color: 'red' }}>false</span>,
	// 			item.location_transaction_synced ? <span style={{ color: 'green' }}>true</span> : <span style={{ color: 'red' }}>false</span>,
	// 			<Group>
	// 				<Button loading={isImporting} onClick={() => handleReprocessDay(item.operational_date)} size="xs">Reprocess Day</Button>
	// 				<Button color="red" loading={isImporting} onClick={() => handleDeleteDayBufferDataVehicleEvents(item.operational_date)} size="xs">Delete Day BufferData VehicleEvents</Button>
	// 				<Button color="red" loading={isImporting} onClick={() => handleDeleteDayBufferDataValidationTransactions(item.operational_date)} size="xs">Delete Day BufferData ValidationTransactions</Button>
	// 				<Button color="red" loading={isImporting} onClick={() => handleDeleteDayBufferDataLocationTransactions(item.operational_date)} size="xs">Delete Day BufferData LocationTransactions</Button>
	// 			</Group>,
	// 		])
	// 		.sort((a, b) => a[0] - b[0]);
	// 	const head = ['operational_date', 'vehicle_events', 'validation_transactions', 'location_transactions', 'slamanagerbufferdb operations'];
	// 	return { body, head };
	// }, [slaProgressBufferDayData]);

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
					{slaProgressByDayLoading ? <Loader /> : <Table data={progressByDayTableData} highlightOnHover withTableBorder />}
					{/* <Table data={progressBufferDaysTableData} highlightOnHover withTableBorder /> */}
				</AppLayoutSection>

				<Divider />

				<AppLayoutSection>

					<SimpleGrid cols={3}>
						<Button color="blue" loading={isImporting} onClick={handleMarkStuckTripsAsPending}>
							Mark Stuck Trips as Pending
						</Button>
						<Button color="orange" loading={isImporting} onClick={handleMarkAllRidesAsPending}>
							Mark All Trips as Pending Analysis
						</Button>
						<Button color="red" loading={isImporting} onClick={handleDeleteAllTripsAndMarkAllArchivesAdPendingParse}>
							Delete All Trips And Mark All Archives As Pending Parse
						</Button>
					</SimpleGrid>
				</AppLayoutSection>

				<Divider />

				<AppLayoutSection>

					<SimpleGrid cols={3}>
						<Button color="grape" loading={isImporting} onClick={handleDeleteBufferDataVehicleEvents}>
							Delete Buffer Data vehicle_event
						</Button>
						<Button color="grape" loading={isImporting} onClick={handleDeleteBufferDataValidationTransactions}>
							Delete Buffer Data validation_transaction
						</Button>
						<Button color="grape" loading={isImporting} onClick={handleDeleteBufferDataLocationTransactions}>
							Delete Buffer Data location_transaction
						</Button>
					</SimpleGrid>
				</AppLayoutSection>

			</Pannel>
		</AppAuthenticationCheck>
	);

	//
}
