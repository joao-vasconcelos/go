/* * */

import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import { useTranslations } from 'next-intl';

/* * */

export default function FaresExplorerPage() {
	//

	//
	// A. Setup variables

	const t = useTranslations('FaresExplorerPage');

	//
	// B. Render components

	return <NoDataLabel text={t('no_data')} fill />;

	//
}
