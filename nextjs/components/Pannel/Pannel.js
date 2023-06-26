import Loader from '../Loader/Loader';
import styles from './Pannel.module.css';

export default function Pannel({ loading, header, children, footer }) {
  //

  return (
    <div className={styles.container}>
      <Loader visible={loading} full />
      {header && <div className={styles.header}>{header}</div>}
      <div className={styles.body}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );

  //
}
