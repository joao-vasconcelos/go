'use client';

/* * */

import { useTranslations } from 'next-intl';
import { Alert, Button, Tooltip } from '@mantine/core';
import { IconListNumbers, IconMoodAnnoyed } from '@tabler/icons-react';
import { useReportsExplorerRevenueContext } from '@/contexts/ReportsExplorerRevenueContext';
import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';

/* * */

export default function ReportsExplorerRevenueResultSummaryFrequentDownload() {
	//

	//
	// A. Setup variables

	const t = useTranslations('ReportsExplorerRevenueResultSummaryFrequentDownload');
	const reportsExplorerSalesContext = useReportsExplorerRevenueContext();

	//
	// B. Render components

	return (
		<AppAuthenticationCheck permissions={[{ scope: 'reports', action: 'download', fields: [{ key: 'kind', values: ['revenue'] }] }]}>
			<div>
				<Tooltip label={reportsExplorerSalesContext.details.is_loading ? t('is_loading') : t('description')} position="bottom" withArrow>
					<Button onClick={reportsExplorerSalesContext.downloadPrepaidDetail} leftSection={<IconListNumbers size={18} />} loading={reportsExplorerSalesContext.details.is_loading} variant="light" size="xs" color="grape">
						{t('label')}
					</Button>
				</Tooltip>
			</div>
			{reportsExplorerSalesContext.details.is_error &&
        <Alert icon={<IconMoodAnnoyed size={20} />} title={t('is_error.title')} color="red">
        	{t('is_error.description', { errorMessage: reportsExplorerSalesContext.details.is_error })}
        </Alert>
			}
		</AppAuthenticationCheck>
	);

	//
}