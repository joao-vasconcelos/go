/* * */

import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import { useTranslations } from 'next-intl';

/* * */

export default function TypologiesExplorerPage() {
	//

	//
	// A. Setup variables

	const t = useTranslations('TypologiesExplorerPage');

	//
	// B. Render components

	return <NoDataLabel text={t('no_data')} fill />;

	//
}
