/* * */

import styles from './Standout.module.css';

/* * */

export default function Standout({ icon, title, description, children }) {
  return (
    <div className={styles.container}>
      {(icon || title) && (
        <div className={styles.header}>
          {icon && icon}
          {title && <h4 className={styles.title}>{title}</h4>}
        </div>
      )}
      {(description || children) && (
        <div className={styles.content}>
          {description && <p className={styles.description}>{description}</p>}
          {children && <div className={styles.children}>{children}</div>}
        </div>
      )}
    </div>
  );
}
