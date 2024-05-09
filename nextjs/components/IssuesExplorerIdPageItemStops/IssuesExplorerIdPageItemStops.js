'use client';

/* * */

import useSWR from 'swr';
import { useMemo, useState } from 'react';
import { ActionIcon, Button, Select } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useIssuesExplorerContext } from '@/contexts/IssuesExplorerContext';
import styles from './IssuesExplorerIdPageItemStops.module.css';
import { StopsExplorerStop } from '../StopsExplorerStop/StopsExplorerStop';
import { IconTrash } from '@tabler/icons-react';

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
		return allStopsData.map((stop) => ({ value: stop._id, label: `[${stop.code}] ${stop.name}` }));
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
				{issuesExplorerContext.form.values.related_stops.length > 0 &&
          issuesExplorerContext.form.values.related_stops.map((stopId) => <div key={stopId} className={styles.itemWrapper}>
          		<StopsExplorerStop stopId={stopId} />
          		{!issuesExplorerContext.page.is_read_only &&
                <ActionIcon onClick={() => handleRemoveRelatedStop(stopId)} variant="light" color="red">
                	<IconTrash size={20} />
                </ActionIcon>
          		}
          	</div>)}
			</div>
			{!issuesExplorerContext.page.is_read_only &&
        <>
        	<Select
        		label={t('related_stops.label')}
        		placeholder={t('related_stops.placeholder')}
        		nothingFoundMessage={t('related_stops.nothingFound')}
        		data={allStopsDataFormatted}
        		value={selectedStopId}
        		onChange={setSelectedStopId}
        		limit={100}
        		w="100%"
        		readOnly={issuesExplorerContext.page.is_read_only}
        		searchable
        	/>
        	<Button onClick={handleAddRelatedStop} disabled={!selectedStopId || issuesExplorerContext.page.is_read_only}>
            Add Related Stop
        	</Button>
        </>
			}
		</div>
	);
}