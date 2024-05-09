/* * */

import Text from '@/components/Text/Text';
import { useTranslations } from 'next-intl';

/* * */

export default function ExportsExplorerFormIntro() {
	//

	//
	// A. Setup variables

	const t = useTranslations('ExportsExplorerFormIntro');

	//
	// B. Render components

	return (
		<Text size="h4" color="muted">
			{t('description')}
		</Text>
	);

	//
}