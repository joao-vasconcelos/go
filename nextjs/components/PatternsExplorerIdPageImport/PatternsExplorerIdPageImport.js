'use client';

/* * */

import GTFSParser from '@/components/GTFSParser/GTFSParser';
import { usePatternsExplorerContext } from '@/contexts/PatternsExplorerContext';
import notify from '@/services/notify';
import { Button, Divider, SimpleGrid, Text, Tooltip } from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import styles from './PatternsExplorerIdPageImport.module.css';

/* * */

export default function PatternsExplorerIdPageImport() {
	//

	//
	// A. Setup variables

	const t = useTranslations('PatternsExplorerIdPageImport');

	const patternsExplorerContext = usePatternsExplorerContext();

	const [parseResult, setParseResult] = useState();

	//
	// B. Handle actions

	const handleParse = (gtfsAsJson) => {
		try {
			const trips = [];
			for (const route of gtfsAsJson) {
				for (const trip of route.trips) {
					trips.push(trip);
				}
			}
			setParseResult(trips);
		}
		catch (error) {
			console.log(error);
			setParseResult();
		}
	};

	const handleClearTable = () => {
		setParseResult();
	};

	const handlePathImport = (trip) => {
		openConfirmModal({
			centered: true,
			children: (
				<SimpleGrid cols={1}>
					<Text>Tem a certeza que pretende importar este pattern?</Text>
					<Divider />
					<div>
						<Text>COMO ESTÁ AGORA</Text>
						<Text>Paragens: {patternsExplorerContext.item_data?.path.length}</Text>
						<Text>Shape: {patternsExplorerContext.item_data?.shape.extension} metros</Text>
					</div>
					<Divider />
					<div>
						<Text>COMO VAI FICAR DEPOIS DE IMPORTAR</Text>
						<Text>Paragens: {trip.path.length}</Text>
						<Text>Shape: {parseInt(trip.shape.points[trip.shape.points.length - 1].shape_dist_traveled)} metros</Text>
					</div>
				</SimpleGrid>
			),
			closeOnClickOutside: true,
			labels: { cancel: 'Manter como está', confirm: 'Sim, importar percurso' },
			onConfirm: async () => {
				try {
					notify('pattern-import', 'loading', t('import.loading'));
					await patternsExplorerContext.importPatternFromGtfs({ path: trip.path, shape: trip.shape.points });
					notify('pattern-import', 'success', t('import.success', { trip_id: trip.trip_id }));
				}
				catch (error) {
					console.log(error);
					notify('pattern-import', 'error', error.message || t('import.error'));
				}
			},
			title: (
				<Text fw={700} size="lg">
					Replace Path and Shape?
				</Text>
			),
		});
	};

	//
	// C. Render components

	const TableHeader = () => (
		<div className={styles.tableHeader}>
			<div className={styles.tableHeaderColumn}>{t('table.header.route_id')}</div>
			<div className={styles.tableHeaderColumn}>{t('table.header.trip_headsign')}</div>
			<div className={styles.tableHeaderColumn}>{t('table.header.stop_count')}</div>
			<div className={styles.tableHeaderColumn}>{t('table.header.import')}</div>
		</div>
	);
	const TableBody = () => (
		<div className={styles.tableBody}>
			{parseResult.map(trip => (
				<div key={trip.trip_id} className={styles.tableBodyRow}>
					<div className={styles.tableBodyColumn}>{trip.route_id}</div>
					<div className={styles.tableBodyColumn}>{trip.trip_headsign}</div>
					<div className={styles.tableBodyColumn}>{trip.path.length}</div>
					<div className={styles.tableBodyColumn}>
						<Tooltip color="red" label={t('table.body.import.description')} width={220} multiline withArrow>
							<Button onClick={() => handlePathImport(trip)} size="xs">
								{t('table.body.import.title')}
							</Button>
						</Tooltip>
					</div>
				</div>
			))}
		</div>
	);
	const ParsingResults = () => (
		<div className={styles.container}>
			<div className={styles.title}>{t('title')}</div>
			<div className={styles.tableContainer}>
				<TableHeader />
				<TableBody />
			</div>
			<div>
				<Button color="gray" onClick={handleClearTable} size="xs" variant="light">
					{t('clear.title')}
				</Button>
			</div>
		</div>
	);
	return parseResult ? <ParsingResults /> : <GTFSParser onParse={handleParse} />;

	//
}
