'use client';

/* * */

import Text from '@/components/Text/Text';
import { ActionIcon } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useReportsExplorerRealtimeContext } from '@/contexts/ReportsExplorerRealtimeContext';
import { IconChevronLeft } from '@tabler/icons-react';
import ListHeader from '@/components/ListHeader/ListHeader';

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
			<ActionIcon size="lg" onClick={reportsExplorerRealtimeContext.clearTripId} variant="subtle" color="gray">
				<IconChevronLeft size="20px" />
			</ActionIcon>
			<Text size="h2" full>
				{t('title', { trip_id: reportsExplorerRealtimeContext.selectedTrip.trip_id })}
			</Text>
		</ListHeader>
	);

	//
}