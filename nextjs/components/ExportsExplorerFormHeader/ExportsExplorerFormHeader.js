/* * */

import ListHeader from '@/components/ListHeader/ListHeader';
import Text from '@/components/Text/Text';
import { IconCloudPlus } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

/* * */

export default function ExportsExplorerFormHeader() {
	//

	//
	// A. Setup variables

	const t = useTranslations('ExportsExplorerFormHeader');

	//
	// B. Render components

	return (
		<ListHeader>
			<IconCloudPlus size={22} />
			<Text size="h2" full>
				{t('title')}
			</Text>
		</ListHeader>
	);

	//
}
