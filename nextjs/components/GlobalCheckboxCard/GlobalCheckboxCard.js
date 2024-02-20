/* * */

import styles from './GlobalCheckboxCard.module.css';
import { Checkbox } from '@mantine/core';

/* * */

export default function GlobalCheckboxCard({ label = '', description = '', value = false, onChange = () => {}, readOnly = false, disabled = false, children }) {
  //

  //
  // A. Handle actions

  const handleToggle = () => {
    if (readOnly || disabled) return;
    onChange(!value);
  };

  //
  // B. Render components

  return (
    <div>
      <div className={`${styles.container} ${value && styles.checked} ${readOnly && styles.readOnly} ${disabled && styles.disabled}`} onClick={handleToggle}>
        <Checkbox checked={value} onChange={() => {}} size="md" readOnly={readOnly} disabled={disabled} />
        <div className={styles.innerWrapper}>
          <p className={styles.label}>{label}</p>
          <p className={styles.description}>{description}</p>
          {children && (
            <div className={styles.childrenWrapper} onClick={(e) => e.stopPropagation()}>
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  //
}
