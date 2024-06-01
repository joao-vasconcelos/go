'use client';

/* * */

import { useIssuesExplorerContext } from '@/contexts/IssuesExplorerContext';
import { ActionIcon, Button, Select } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import useSWR from 'swr';

import { StopsExplorerStop } from '../StopsExplorerStop/StopsExplorerStop';
import styles from './IssuesExplorerIdPageItemStops.module.css';

/* * */

export default function IssuesExplorerIdPageItemStops() {
	//

	//
	// A. Setup variables

	const t = useTranslations('IssuesExplorerIdPageItemStops');
	const issuesExplorerContext = useIssuesExplorerContext();

	const [selectedStopId, setSelectedStopId] = useState(null);

	//
	// B. Fetch data

	const { data: allStopsData } = useSWR('/api/stops');

	//
	// C. Transform data

	const allStopsDataFormatted = useMemo(() => {
		// Exit if no data is available
		if (!allStopsData) return [];
		// For each stop check if it related with the current issue or not
		return allStopsData.map(stop => ({ label: `[${stop.code}] ${stop.name}`, value: stop._id }));
		//
	}, [allStopsData]);

	//
	// D. Handle actions

	const handleAddRelatedStop = () => {
		issuesExplorerContext.toggleRelatedStop(selectedStopId);
		setSelectedStopId(null);
	};

	const handleRemoveRelatedStop = (stopId) => {
		issuesExplorerContext.toggleRelatedStop(stopId);
	};

	//
	// E. Render components

	return (
		<div className={styles.container}>
			<div className={styles.list}>
				{issuesExplorerContext.form.values.related_stops.length > 0
				&& issuesExplorerContext.form.values.related_stops.map(stopId => (
					<div key={stopId} className={styles.itemWrapper}>
						<StopsExplorerStop stopId={stopId} />
						{!issuesExplorerContext.page.is_read_only
						&& (
							<ActionIcon color="red" onClick={() => handleRemoveRelatedStop(stopId)} variant="light">
								<IconTrash size={20} />
							</ActionIcon>
						)}
					</div>
				))}
			</div>
			{!issuesExplorerContext.page.is_read_only
			&& (
				<>
					<Select
						data={allStopsDataFormatted}
						label={t('related_stops.label')}
						limit={100}
						nothingFoundMessage={t('related_stops.nothingFound')}
						onChange={setSelectedStopId}
						placeholder={t('related_stops.placeholder')}
						readOnly={issuesExplorerContext.page.is_read_only}
						value={selectedStopId}
						w="100%"
						searchable
					/>
					<Button disabled={!selectedStopId || issuesExplorerContext.page.is_read_only} onClick={handleAddRelatedStop}>
						Add Related Stop
					</Button>
				</>
			)}
		</div>
	);
}
