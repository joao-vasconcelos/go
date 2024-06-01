/* * */

import AppHeader from '@/components/AppHeader/AppHeader';
import { CMIcon } from '@/components/AppLogos/AppLogos';
import AppSidebar from '@/components/AppSidebar/AppSidebar';
import { Link } from '@/translations/navigation';

import styles from './AppWrapper.module.css';

/* * */

export default function AppWrapper({ children }) {
	return (
		<div className={styles.container}>
			<Link className={styles.appIcon} href="/">
				<CMIcon />
			</Link>
			<AppHeader />
			<AppSidebar />
			<div className={styles.content}>{children}</div>
		</div>
	);
}
