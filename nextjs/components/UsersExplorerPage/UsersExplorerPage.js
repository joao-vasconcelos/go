/* * */

import { useTranslations } from 'next-intl';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';

/* * */

export default function UsersExplorerPage() {
	//

	//
	// A. Setup variables

	const t = useTranslations('UsersExplorerPage');

	//
	// B. Render components

	return <NoDataLabel fill text={t('no_data')} />;

	//
}