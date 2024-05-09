'use client';

/* * */

import { useTranslations } from 'next-intl';
import { useAlertsExplorerContext } from '@/contexts/AlertsExplorerContext';
import styles from './AlertsExplorerIdPageItemPreview.module.css';

/* * */

export default function AlertsExplorerIdPageItemPreview() {
	//

	//
	// A. Setup variables

	const t = useTranslations('AlertsExplorerIdPageItemPreview');
	const alertsExplorerContext = useAlertsExplorerContext();

	//
	// D. Render components

	return <div className={styles.container}>Este alerta, que vai ter início a --active_period_start-- e terminar a --active_period_end--, e que é referente aos municípios --affected_municipalities--, informa que ...</div>;

	//
}