'use client';

/* * */

import AlertsExplorerIdPageItemAffectedRoutesRouteStops from '@/components/AlertsExplorerIdPageItemAffectedRoutesRouteStops/AlertsExplorerIdPageItemAffectedRoutesRouteStops';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import Standout from '@/components/Standout/Standout';
import { useAlertsExplorerContext } from '@/contexts/AlertsExplorerContext';
import { AlertAffectedRouteDefault } from '@/schemas/Alert/default';
import { ActionIcon, Button, MultiSelect, Select, Tooltip } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import useSWR from 'swr';

import styles from './AlertsExplorerIdPageItemAffectedRoutes.module.css';

/* * */

export default function AlertsExplorerIdPageItemAffectedRoutes() {
	//

	//
	// A. Setup variables

	const t = useTranslations('AlertsExplorerIdPageItemAffectedRoutes');
	const alertsExplorerContext = useAlertsExplorerContext();

	//
	// B. Fetch data

	const { data: allLiveRoutesData } = useSWR('https://api.carrismetropolitana.pt/routes');

	//
	// C. Transform data

	const availableLiveRoutes = useMemo(() => {
		if (!allLiveRoutesData) return [];
		return allLiveRoutesData.map((item) => {
			return { label: `[${item.id}] ${item.long_name}`, value: item.id };
		});
	}, [allLiveRoutesData]);

	//
	// D. Handle actions

	const handleInsertAffectedRoute = () => {
		alertsExplorerContext.form.insertListItem('affected_routes', AlertAffectedRouteDefault);
	};

	const handleRemoveAffectedRoute = (affectedRouteIndex) => {
		alertsExplorerContext.form.removeListItem('affected_routes', affectedRouteIndex);
	};

	//
	// E. Render components

	return (
		<div className={styles.container}>
			{alertsExplorerContext.form.values.affected_routes.length > 0
				? alertsExplorerContext.form.values.affected_routes.map((affectedRoute, affectedRouteIndex) => (
					<Standout
						key={affectedRouteIndex}
						title={t('form.affected_routes.label')}
						icon={(
							<Tooltip label={t('operations.remove.label')} withArrow>
								<ActionIcon color="gray" disabled={alertsExplorerContext.page.is_read_only} onClick={() => handleRemoveAffectedRoute(affectedRouteIndex)} size="sm" variant="subtle">
									<IconTrash size={18} />
								</ActionIcon>
							</Tooltip>
						)}
					>
						<Select
							nothingFoundMessage={t('form.affected_routes.nothingFound')}
							placeholder={t('form.affected_routes.placeholder')}
							{...alertsExplorerContext.form.getInputProps(`affected_routes.${affectedRouteIndex}.route_id`)}
							data={availableLiveRoutes}
							limit={100}
							readOnly={alertsExplorerContext.page.is_read_only}
							w="100%"
							clearable
							searchable
						/>
						<AlertsExplorerIdPageItemAffectedRoutesRouteStops affectedRouteIndex={affectedRouteIndex} />
					</Standout>
				))
				: (
					<Standout>
						<NoDataLabel text={t('form.affected_routes.no_data')} />
					</Standout>
				)}
			<Button disabled={alertsExplorerContext.page.is_read_only} onClick={handleInsertAffectedRoute} variant="light">
				{t('operations.insert.label')}
			</Button>
		</div>
	);

	//
}
