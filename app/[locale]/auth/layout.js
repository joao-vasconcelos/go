import styles from './layout.module.css';
import appBackground from '../../../public/background.jpg';
import { CMLogo } from '../../../components/AppLogos/AppLogos';

export default async function AuthLayout({ children }) {
  return (
    <div className={styles.container} style={{ backgroundImage: `url(${appBackground.src})` }}>
      <div className={styles.loginForm}>
        <div className={styles.logoWrapper}>
          <CMLogo />
        </div>
        <div className={styles.formWrapper}>{children}</div>
      </div>
    </div>
  );
}
