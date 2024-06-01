'use client';

/* * */

import { Section } from '@/components/Layouts/Layouts';
import Text from '@/components/Text/Text';
import { useTranslations } from 'next-intl';

/* * */

export default function ReportsExplorerRealtimeResultTripDetailDescription() {
	//

	//
	// A. Setup variables

	const t = useTranslations('ReportsExplorerRealtimeResultTripDetailDescription');

	//
	// B. Render components

	return (
		<Section>
			<Text color="muted" size="h4">
				{t('summary')}
			</Text>
		</Section>
	);

	//
}
