'use client';

/* * */

import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import Standout from '@/components/Standout/Standout';
import { useAlertsExplorerContext } from '@/contexts/AlertsExplorerContext';
import { AlertAffectedStopDefault } from '@/schemas/Alert/default';
import { ActionIcon, Button, Select, Tooltip } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import useSWR from 'swr';

import AlertsExplorerIdPageItemAffectedStopsStopRoutes from '../AlertsExplorerIdPageItemAffectedStopsStopRoutes/AlertsExplorerIdPageItemAffectedStopsStopRoutes';
import styles from './AlertsExplorerIdPageItemAffectedStops.module.css';

/* * */

export default function AlertsExplorerIdPageItemAffectedStops() {
	//

	//
	// A. Setup variables

	const t = useTranslations('AlertsExplorerIdPageItemAffectedStops');
	const alertsExplorerContext = useAlertsExplorerContext();

	//
	// B. Fetch data

	const { data: allLiveStopsData } = useSWR('https://api.carrismetropolitana.pt/stops');

	//
	// C. Transform data

	const availableLiveStops = useMemo(() => {
		if (!allLiveStopsData) return [];
		return allLiveStopsData.map((item) => {
			return { label: `[${item.id}] ${item.name}`, value: item.id };
		});
	}, [allLiveStopsData]);

	//
	// D. Handle actions

	const handleInsertAffectedStop = () => {
		alertsExplorerContext.form.insertListItem('affected_stops', AlertAffectedStopDefault);
	};

	const handleRemoveAffectedStop = (index) => {
		console.log(index);
		alertsExplorerContext.form.removeListItem('affected_stops', index);
	};

	//
	// E. Render components

	return (
		<div className={styles.container}>
			{alertsExplorerContext.form.values.affected_stops.length > 0
				? alertsExplorerContext.form.values.affected_stops.map((affectedStop, affectedStopIndex) => (
					<Standout
						key={affectedStopIndex}
						title={t('title')}
						icon={(
							<Tooltip label={t('operations.remove.label')} withArrow>
								<ActionIcon color="gray" disabled={alertsExplorerContext.page.is_read_only} onClick={() => handleRemoveAffectedStop(affectedStopIndex)} size="sm" variant="subtle">
									<IconTrash size={18} />
								</ActionIcon>
							</Tooltip>
						)}
					>
						<Select
							nothingFoundMessage={t('form.affected_stops.nothingFound')}
							placeholder={t('form.affected_stops.placeholder')}
							{...alertsExplorerContext.form.getInputProps(`affected_stops.${affectedStopIndex}.stop_id`)}
							data={availableLiveStops}
							limit={100}
							readOnly={alertsExplorerContext.page.is_read_only}
							w="100%"
							clearable
							searchable
						/>
						<AlertsExplorerIdPageItemAffectedStopsStopRoutes affectedStopIndex={affectedStopIndex} />
					</Standout>
				))
				: (
					<Standout>
						<NoDataLabel text={t('no_data')} />
					</Standout>
				)}
			<Button disabled={alertsExplorerContext.page.is_read_only} onClick={handleInsertAffectedStop} variant="light">
				{t('operations.insert.label')}
			</Button>
		</div>
	);

	//
}
