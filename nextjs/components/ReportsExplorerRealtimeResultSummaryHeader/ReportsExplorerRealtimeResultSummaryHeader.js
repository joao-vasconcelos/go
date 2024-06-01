'use client';

/* * */

import ListHeader from '@/components/ListHeader/ListHeader';
import Text from '@/components/Text/Text';
import { useReportsExplorerRealtimeContext } from '@/contexts/ReportsExplorerRealtimeContext';
import { ActionIcon } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

/* * */

export default function ReportsExplorerRealtimeResultSummaryHeader() {
	//

	//
	// A. Setup variables

	const t = useTranslations('ReportsExplorerRealtimeResultSummaryHeader');
	const reportsExplorerRealtimeContext = useReportsExplorerRealtimeContext();

	//
	// B. Render components

	return (
		<ListHeader>
			<ActionIcon color="gray" onClick={reportsExplorerRealtimeContext.clearAllData} size="lg" variant="subtle">
				<IconX size="20px" />
			</ActionIcon>
			<Text size="h2" full>
				{t('title')}
			</Text>
		</ListHeader>
	);

	//
}
