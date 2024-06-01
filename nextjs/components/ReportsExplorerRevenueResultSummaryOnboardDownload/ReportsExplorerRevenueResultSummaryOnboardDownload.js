'use client';

/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import { useReportsExplorerRevenueContext } from '@/contexts/ReportsExplorerRevenueContext';
import { Alert, Button, Tooltip } from '@mantine/core';
import { IconListNumbers, IconMoodAnnoyed } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

/* * */

export default function ReportsExplorerRevenueResultSummaryOnboardDownload() {
	//

	//
	// A. Setup variables

	const t = useTranslations('ReportsExplorerRevenueResultSummaryOnboardDownload');
	const reportsExplorerSalesContext = useReportsExplorerRevenueContext();

	//
	// B. Render components

	return (
		<AppAuthenticationCheck permissions={[{ action: 'download', fields: [{ key: 'kind', values: ['revenue'] }], scope: 'reports' }]}>
			<div>
				<Tooltip label={reportsExplorerSalesContext.details.is_loading ? t('is_loading') : t('description')} position="bottom" withArrow>
					<Button color="grape" leftSection={<IconListNumbers size={18} />} loading={reportsExplorerSalesContext.details.is_loading} onClick={reportsExplorerSalesContext.downloadOnboardDetail} size="xs" variant="light">
						{t('label')}
					</Button>
				</Tooltip>
			</div>
			{reportsExplorerSalesContext.details.is_error
			&& (
				<Alert color="red" icon={<IconMoodAnnoyed size={20} />} title={t('is_error.title')}>
					{t('is_error.description', { errorMessage: reportsExplorerSalesContext.details.is_error })}
				</Alert>
			)}
		</AppAuthenticationCheck>
	);

	//
}
