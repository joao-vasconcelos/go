'use client';

/* * */

import ListHeader from '@/components/ListHeader/ListHeader';
import Text from '@/components/Text/Text';
import { useReportsExplorerRealtimeContext } from '@/contexts/ReportsExplorerRealtimeContext';
import { ActionIcon } from '@mantine/core';
import { IconChevronLeft } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

/* * */

export default function ReportsExplorerRealtimeResultTripDetailHeader() {
	//

	//
	// A. Setup variables

	const t = useTranslations('ReportsExplorerRealtimeResultTripDetailHeader');
	const reportsExplorerRealtimeContext = useReportsExplorerRealtimeContext();

	//
	// B. Render components

	return (
		<ListHeader>
			<ActionIcon color="gray" onClick={reportsExplorerRealtimeContext.clearTripId} size="lg" variant="subtle">
				<IconChevronLeft size="20px" />
			</ActionIcon>
			<Text size="h2" full>
				{t('title', { trip_id: reportsExplorerRealtimeContext.selectedTrip.trip_id })}
			</Text>
		</ListHeader>
	);

	//
}
