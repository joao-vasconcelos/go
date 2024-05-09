'use client';

/* * */

import Standout from '@/components/Standout/Standout';
import { useReportsExplorerRealtimeContext } from '@/contexts/ReportsExplorerRealtimeContext';
import { SegmentedControl } from '@mantine/core';
import { IconSortAscendingNumbers } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

/* * */

export default function ReportsExplorerRealtimeResultTripDetailToolsOrdering() {
	//

	//
	// A. Setup variables

	const t = useTranslations('ReportsExplorerRealtimeResultTripDetailToolsOrdering');
	const reportsExplorerRealtimeContext = useReportsExplorerRealtimeContext();

	//
	// B. Render components

	return (
		<Standout icon={<IconSortAscendingNumbers size={20} />} title={t('title')} description={t('description')} collapsible defaultOpen={false}>
			<SegmentedControl
				value={reportsExplorerRealtimeContext.form.event_order_type}
				onChange={reportsExplorerRealtimeContext.updateEventOrderType}
				data={[
					{ label: t('event_order_type.insert_timestamp'), value: 'insert_timestamp' },
					{ label: t('event_order_type.header_timestamp'), value: 'header_timestamp' },
					{ label: t('event_order_type.vehicle_timestamp'), value: 'vehicle_timestamp' },
				]}
				style={{ alignSelf: 'flex-start' }}
			/>
		</Standout>
	);

	//
}