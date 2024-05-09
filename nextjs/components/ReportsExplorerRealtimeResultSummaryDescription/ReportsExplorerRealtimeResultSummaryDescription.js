/* * */

import Text from '@/components/Text/Text';
import { Section } from '@/components/Layouts/Layouts';
import { useTranslations } from 'next-intl';

/* * */

export default function ReportsExplorerRealtimeResultSummaryDescription() {
	//

	//
	// A. Setup variables

	const t = useTranslations('ReportsExplorerRealtimeResultSummaryDescription');

	//
	// B. Render components

	return (
		<Section>
			<Text size="h4" color="muted">
				{t('description')}
			</Text>
		</Section>
	);

	//
}