/* * */

import { useTranslations } from 'next-intl';

import styles from './NoDataLabel.module.css';

/* * */

export default function NoDataLabel({ fill = false, text }) {
	//

	//
	// A. Setup variables

	const t = useTranslations('NoDataLabel');

	//
	// B. Render components

	return <div className={`${styles.container} ${fill && styles.fill}`}>{text || t('title')}</div>;

	//
}
