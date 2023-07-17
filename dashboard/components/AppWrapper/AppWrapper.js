import Link from 'next/link';
import { CMIcon } from '@/components/AppLogos/AppLogos';
import styles from './AppWrapper.module.css';
import AppHeader from '@/components/AppHeader/AppHeader';
import AppSidebar from '@/components/AppSidebar/AppSidebar';

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
