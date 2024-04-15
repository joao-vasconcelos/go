/* * */

import { Link } from '@/translations/navigation';
import styles from './ReportsExplorerItem.module.css';
import AppAuthenticationCheck from '@/components/AppAuthenticationCheck/AppAuthenticationCheck';

/* * */

export default function ReportsExplorerItem({ id = '', icon, title = '', description = '' }) {
  return (
    <AppAuthenticationCheck permissions={[{ scope: 'reports', action: 'view', fields: [{ key: 'kind', values: [id] }] }]}>
      <Link className={styles.container} href={`/reports/${id}`}>
        {icon && <div className={styles.icon}>{icon}</div>}
        {title && <div className={styles.title}>{title}</div>}
        {description && <div className={styles.description}>{description}</div>}
      </Link>
    </AppAuthenticationCheck>
  );
}
