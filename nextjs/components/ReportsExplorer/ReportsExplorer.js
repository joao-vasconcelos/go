/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import { OneFullColumn } from '@/components/Layouts/Layouts';
import ReportsExplorerItem from '@/components/ReportsExplorerItem/ReportsExplorerItem';
import { ReportOptions } from '@/schemas/Report/options';
import { IconArrowsShuffle, IconCoinEuro, IconFlagQuestion } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import styles from './ReportsExplorer.module.css';

/* * */

export default function ReportsExplorer() {
	//

	//
	// A. Setup variables

	const reportOptionsLabels = useTranslations('ReportOptions');

	//
	// B. Transform data

	const reportIcons = {
		realtime: <IconArrowsShuffle size={50} />,
		revenue: <IconCoinEuro size={50} />,
		sla: <IconFlagQuestion size={50} />,
	};

	//
	// C. Render components

	return (
		<AppAuthenticationCheck permissions={[{ action: 'view', scope: 'reports' }]} redirect>
			<OneFullColumn
				first={<div className={styles.container}>{ReportOptions.kind && ReportOptions.kind.map(item => <ReportsExplorerItem key={item} description={reportOptionsLabels(`kind.${item}.description`)} icon={reportIcons[item]} id={item} title={reportOptionsLabels(`kind.${item}.label`)} />)}</div>}
			/>
		</AppAuthenticationCheck>
	);

	//
}
