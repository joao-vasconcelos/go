/* * */

import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';
import { Link } from '@/translations/navigation';

import styles from './ReportsExplorerItem.module.css';

/* * */

export default function ReportsExplorerItem({ description = '', icon, id = '', title = '' }) {
	return (
		<AppAuthenticationCheck permissions={[{ action: 'view', fields: [{ key: 'kind', values: [id] }], scope: 'reports' }]}>
			<Link className={styles.container} href={`/reports/${id}`}>
				{icon && <div className={styles.icon}>{icon}</div>}
				{title && <div className={styles.title}>{title}</div>}
				{description && <div className={styles.description}>{description}</div>}
			</Link>
		</AppAuthenticationCheck>
	);
}
