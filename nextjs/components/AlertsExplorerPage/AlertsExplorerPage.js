/* * */

import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import { useTranslations } from 'next-intl';

/* * */

export default function AlertsExplorerPage() {
	//

	//
	// A. Setup variables

	const t = useTranslations('AlertsExplorerPage');

	//
	// B. Render components

	return <NoDataLabel text={t('no_data')} fill />;

	//
}
