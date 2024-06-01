/* * */

import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import { useTranslations } from 'next-intl';

/* * */

export default function TagsExplorerPage() {
	//

	//
	// A. Setup variables

	const t = useTranslations('TagsExplorerPage');

	//
	// B. Render components

	return <NoDataLabel text={t('no_data')} fill />;

	//
}
