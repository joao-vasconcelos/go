'use client';

/* * */

import ListHeader from '@/components/ListHeader/ListHeader';
import Text from '@/components/Text/Text';
import { useReportsExplorerRevenueContext } from '@/contexts/ReportsExplorerRevenueContext';
import { ActionIcon } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

/* * */

export default function ReportsExplorerRevenueResultSummaryHeader() {
	//

	//
	// A. Setup variables

	const t = useTranslations('ReportsExplorerRevenueResultSummaryHeader');
	const reportsExplorerSalesContext = useReportsExplorerRevenueContext();

	//
	// B. Render components

	return (
		<ListHeader>
			<ActionIcon color="gray" onClick={reportsExplorerSalesContext.clearAllData} size="lg" variant="subtle">
				<IconX size="20px" />
			</ActionIcon>
			<Text size="h2" full>
				{t('title')}
			</Text>
		</ListHeader>
	);

	//
}
