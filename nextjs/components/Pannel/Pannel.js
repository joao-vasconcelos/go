/* * */

import styles from './Pannel.module.css';
import Loader from '@/components/Loader/Loader';
import PanelError from '@/components/PanelError/PanelError';

/* * */

export default function Pannel({ loading, validating, error, onRetry, header, footer, children }) {
  //

  return (
    <div className={styles.container}>
      {loading && <Loader visible full />}
      {header && <div className={styles.header}>{header}</div>}
      {error && <PanelError message={error.message} description={error.description} loading={validating} onRetry={onRetry} />}
      <div className={styles.body}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );

  //
}
