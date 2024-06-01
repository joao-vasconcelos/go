/* * */

import { Section } from '@/components/Layouts/Layouts';
import Text from '@/components/Text/Text';
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
			<Text color="muted" size="h4">
				{t('description')}
			</Text>
		</Section>
	);

	//
}
