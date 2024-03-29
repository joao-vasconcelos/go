/* * */

import { Link } from '@/translations/navigation';
import { CMIcon } from '@/components/AppLogos/AppLogos';
import AppHeader from '@/components/AppHeader/AppHeader';
import AppSidebar from '@/components/AppSidebar/AppSidebar';
import styles from './AppWrapper.module.css';

/* * */

export default function AppWrapper({ children }) {
  return (
    <div className={styles.container}>
      <Link href={'/'} className={styles.appIcon}>
        <CMIcon />
      </Link>
      <AppHeader />
      <AppSidebar />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
