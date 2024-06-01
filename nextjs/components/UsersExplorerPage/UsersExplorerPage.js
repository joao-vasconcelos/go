/* * */

import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import { useTranslations } from 'next-intl';

/* * */

export default function UsersExplorerPage() {
	//

	//
	// A. Setup variables

	const t = useTranslations('UsersExplorerPage');

	//
	// B. Render components

	return <NoDataLabel text={t('no_data')} fill />;

	//
}
