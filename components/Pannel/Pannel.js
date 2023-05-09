'use client';

import styles from './Pannel.module.css';
import { LoadingOverlay } from '@mantine/core';

export default function Pannel({ loading, header, children, footer }) {
  //

  return (
    <div className={styles.container}>
      <LoadingOverlay visible={loading} transitionDuration={500} loaderProps={{ size: 'md', color: 'gray' }} />
      {header && <div className={styles.header}>{header}</div>}
      <div className={styles.body}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );

  //
}
