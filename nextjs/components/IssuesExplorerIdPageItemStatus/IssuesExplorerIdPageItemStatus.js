'use client';

/* * */

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Modal, SimpleGrid } from '@mantine/core';
import { useIssuesExplorerContext } from '@/contexts/IssuesExplorerContext';
import styles from './IssuesExplorerIdPageItemStatus.module.css';
import IssuesExplorerAttributeStatus from '../IssuesExplorerAttributeStatus/IssuesExplorerAttributeStatus';
import { Options as IssueOptions } from '@/schemas/Issue/options';
import NoDataLabel from '../NoDataLabel/NoDataLabel';
import { IconCircle, IconCircleCheckFilled } from '@tabler/icons-react';

/* * */

export default function IssuesExplorerIdPageItemStatus() {
  //

  //
  // A. Setup variables

  const t = useTranslations('IssuesExplorerIdPageItemStatus');
  const issuesExplorerContext = useIssuesExplorerContext();
  const [isEditMode, setIsEditMode] = useState(false);

  //
  // B. Transform data

  const allStatusDataFormatted = useMemo(() => {
    // Exit if no data is available
    if (!IssueOptions.status) return [];
    // For each status check if it associated with the current issue or not
    return IssueOptions.status.map((statusValue) => ({ value: statusValue, is_selected: issuesExplorerContext.form.values.status === statusValue }));
    //
  }, [issuesExplorerContext.form.values.status]);

  //
  // B. Handle actions

  const handleEnterEditMode = () => {
    setIsEditMode(true);
  };

  const handleExitEditMode = () => {
    setIsEditMode(false);
  };

  const handleChangeStatus = (statusValue) => {
    // Create a set of tag ids for this issue
    issuesExplorerContext.form.setFieldValue('status', statusValue);
  };

  //
  // C. Render components

  return (
    <>
      <Modal opened={isEditMode} onClose={handleExitEditMode} title={t('modal.title')} size="auto">
        {allStatusDataFormatted.length > 0 ? (
          <div className={styles.listWrapper}>
            {allStatusDataFormatted.map((statusData) => (
              <div key={statusData.value} className={`${styles.itemWrapper} ${statusData.is_selected && styles.isSelected}`} onClick={() => handleChangeStatus(statusData.value)}>
                {statusData.is_selected ? <IconCircleCheckFilled size={18} /> : <IconCircle size={18} />}
                <IssuesExplorerAttributeStatus status={statusData.value} />
              </div>
            ))}
          </div>
        ) : (
          <NoDataLabel fill />
        )}
      </Modal>
      <div className={styles.container} onClick={handleEnterEditMode}>
        <IssuesExplorerAttributeStatus status={issuesExplorerContext.form.values.status} />
      </div>
    </>
  );
}
