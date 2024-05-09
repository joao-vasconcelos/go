/* * */

import { useTranslations } from 'next-intl';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';

/* * */

export default function TagsExplorerPage() {
	//

	//
	// A. Setup variables

	const t = useTranslations('TagsExplorerPage');

	//
	// B. Render components

	return <NoDataLabel fill text={t('no_data')} />;

	//
}