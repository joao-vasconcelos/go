'use client';

/* * */

import { Section } from '@/components/Layouts/Layouts';
import Loader from '@/components/Loader/Loader';
import { useReportsExplorerRealtimeContext } from '@/contexts/ReportsExplorerRealtimeContext';
import { CodeHighlightTabs } from '@mantine/code-highlight';
import { ActionIcon, Button, Divider, Modal, SimpleGrid, Table, TextInput } from '@mantine/core';
import { IconJson, IconSearch, IconX } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import useSWR from 'swr';

import styles from './ReportsExplorerRealtimeResultTripDetailEventsTable.module.css';

/* * */

export default function ReportsExplorerRealtimeResultTripDetailEventsTable() {
	//

	//
	// A. Setup variables

	const t = useTranslations('ReportsExplorerRealtimeResultTripDetailEventsTable');
	const reportsExplorerRealtimeContext = useReportsExplorerRealtimeContext();

	const [searchQuery, setSearchQuery] = useState('');
	const [selectedEventId, setSelectedEventId] = useState(null);

	//
	// B. Transform data

	const { data: selectedEventData } = useSWR(selectedEventId && `/api/reports/realtime/events/_id/${selectedEventId}`);

	//
	// B. Transform data

	const tableDataFiltered = useMemo(() => {
		// Return empty if data is not ready
		console.log(reportsExplorerRealtimeContext.selectedTrip.positions);
		if (!reportsExplorerRealtimeContext.selectedTrip.positions) return [];
		// Iterate through all trip positions
		const sortedPositions = reportsExplorerRealtimeContext.selectedTrip.positions.sort((a, b) => Number(a[reportsExplorerRealtimeContext.form.event_order_type]) - Number(b[reportsExplorerRealtimeContext.form.event_order_type]));
		const clippedPositions = sortedPositions.slice(0, reportsExplorerRealtimeContext.selectedTrip.event_animation_index);
		// uniformize the search query
		const query = searchQuery.toLowerCase().trim();
		// Filter the table data by the search query
		return clippedPositions.filter(item => Object.values(item).join(' ').toLowerCase().includes(query));
		//
	}, [reportsExplorerRealtimeContext.selectedTrip.positions, reportsExplorerRealtimeContext.selectedTrip.event_animation_index, reportsExplorerRealtimeContext.form.event_order_type, searchQuery]);

	//
	// C. Handle actions

	const handleTableSearchQueryChange = ({ currentTarget }) => {
		setSearchQuery(currentTarget.value);
	};

	const handleClearSearchChange = () => {
		setSearchQuery('');
	};

	const handleSelectEvent = (row) => {
		setSelectedEventId(row.tml_event_id);
	};

	const handleClearSelectedEvent = () => {
		setSelectedEventId(null);
	};

	//
	// B. Render components

	return (
		<Section>
			<Modal onClose={handleClearSelectedEvent} opened={selectedEventId} padding={0} size="auto" withCloseButton={false}>
				{selectedEventData
					? (
						<>
							<Section>
								<SimpleGrid cols={1}>
									<Table withColumnBorders withTableBorder>
										<Table.Tbody>
											<Table.Tr>
												<Table.Td>TML Event ID</Table.Td>
												<Table.Td>{selectedEventData._id}</Table.Td>
											</Table.Tr>
											<Table.Tr>
												<Table.Td>Operator Event ID</Table.Td>
												<Table.Td>{selectedEventData.content.entity[0]._id}</Table.Td>
											</Table.Tr>
										</Table.Tbody>
									</Table>
								</SimpleGrid>
								<SimpleGrid cols={2}>
									<Button color="gray" variant="light">
										tbd
									</Button>
								</SimpleGrid>
							</Section>
							<Divider />
							<CodeHighlightTabs code={[{ code: JSON.stringify(selectedEventData, null, '  '), fileName: `${selectedEventData._id}.json`, icon: <IconJson size={15} />, language: 'json' }]} />
						</>
					)
					: (
						<Section>
							<Loader fill visible />
						</Section>
					)}
			</Modal>
			<SimpleGrid cols={1}>
				<TextInput
					leftSection={<IconSearch size={20} />}
					onChange={handleTableSearchQueryChange}
					placeholder={t('search.placeholder')}
					value={searchQuery}
					rightSection={
						searchQuery.length > 0
						&& (
							<ActionIcon color="gray" onClick={handleClearSearchChange} variant="subtle">
								<IconX size={20} />
							</ActionIcon>
						)

					}
				/>
				<Table highlightOnHover>
					<Table.Thead>
						<Table.Tr>
							<Table.Th>{t('table.header.tml_event_id.title')}</Table.Th>
							<Table.Th>{t('table.header.operator_event_id.title')}</Table.Th>
							<Table.Th>{t('table.header.vehicle_timestamp.title')}</Table.Th>
							<Table.Th>{t('table.header.header_timestamp.title')}</Table.Th>
							<Table.Th>{t('table.header.insert_timestamp.title')}</Table.Th>
							<Table.Th>{t('table.header.vehicle_to_insert_delay.title')}</Table.Th>
							<Table.Th>{t('table.header.stop_id.title')}</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{tableDataFiltered.map(row => (
							<Table.Tr key={row.tml_event_id} className={styles.tableRow} onClick={() => handleSelectEvent(row)}>
								<Table.Td>{row.tml_event_id}</Table.Td>
								<Table.Td>{row.operator_event_id}</Table.Td>
								<Table.Td>{row.vehicle_timestamp}</Table.Td>
								<Table.Td>{row.header_timestamp}</Table.Td>
								<Table.Td>{row.insert_timestamp}</Table.Td>
								<Table.Td>{row.insert_timestamp - (row.vehicle_timestamp * 1000)} ms</Table.Td>
								<Table.Td>{row.stop_id}</Table.Td>
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>
			</SimpleGrid>
		</Section>
	);

	//
}
