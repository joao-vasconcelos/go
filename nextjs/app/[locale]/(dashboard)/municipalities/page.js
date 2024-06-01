'use client';

import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import { useTranslations } from 'next-intl';

export default function Page() {
	//

	const t = useTranslations('municipalities');

	return <NoDataLabel text={t('list.no_selection')} fill />;
}
