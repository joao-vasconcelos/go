/* * */

import { Section } from '@/components/Layouts/Layouts';
import Text from '@/components/Text/Text';
import { useTranslations } from 'next-intl';

/* * */

export default function ReportsExplorerRevenueFormSummary() {
	//

	//
	// A. Setup variables

	const t = useTranslations('ReportsExplorerRevenueFormSummary');

	//
	// B. Render components

	return (
		<Section>
			<Text color="muted" size="h4">
				{t('text')}
			</Text>
		</Section>
	);

	//
}
