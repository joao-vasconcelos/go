/* * */

import AppButtonBack from '@/components/AppButtonBack/AppButtonBack';
import ListHeader from '@/components/ListHeader/ListHeader';
import ReportsExplorerSlaHeaderToolbar from '@/components/ReportsExplorerSlaHeaderToolbar/ReportsExplorerSlaHeaderToolbar';
import Text from '@/components/Text/Text';
import { Divider } from '@mantine/core';
import { useTranslations } from 'next-intl';

import styles from './ReportsExplorerSlaHeader.module.css';

/* * */

export default function ReportsExplorerSlaHeader() {
	//

	//
	// A. Setup variables

	const t = useTranslations('ReportsExplorerSlaHeader');

	//
	// B. Render components

	return (
		<div className={styles.container}>
			<ListHeader>
				<AppButtonBack href="/reports" />
				<Text size="h1" full>
					{t('title')}
				</Text>
			</ListHeader>
			<Divider />
			<ReportsExplorerSlaHeaderToolbar />
		</div>
	);

	//
}
