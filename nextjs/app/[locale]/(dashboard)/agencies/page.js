'use client';

import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import { useTranslations } from 'next-intl';

export default function Page() {
	//

	const t = useTranslations('agencies');

	return <NoDataLabel text={t('list.no_selection')} fill />;
}
