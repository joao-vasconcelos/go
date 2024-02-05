'use client';

/* * */

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Modal, SimpleGrid } from '@mantine/core';
import { useIssuesExplorerContext } from '@/contexts/IssuesExplorerContext';
import styles from './IssuesExplorerIdPageItemPriority.module.css';
import IssuesExplorerAttributePriority from '../IssuesExplorerAttributePriority/IssuesExplorerAttributePriority';
import { Options as IssueOptions } from '@/schemas/Issue/options';
import NoDataLabel from '../NoDataLabel/NoDataLabel';
import { IconCircle, IconCircleCheckFilled } from '@tabler/icons-react';

/* * */

export default function IssuesExplorerIdPageItemPriority() {
  //

  //
  // A. Setup variables

  const t = useTranslations('IssuesExplorerIdPageItemPriority');
  const issuesExplorerContext = useIssuesExplorerContext();
  const [isEditMode, setIsEditMode] = useState(false);

  //
  // B. Transform data

  const allPriorityDataFormatted = useMemo(() => {
    // Exit if no data is available
    if (!IssueOptions.priority) return [];
    // For each priority check if it associated with the current issue or not
    return IssueOptions.priority.map((priorityValue) => ({ value: priorityValue, is_selected: issuesExplorerContext.form.values.priority === priorityValue }));
    //
  }, [issuesExplorerContext.form.values.priority]);

  //
  // B. Handle actions

  const handleEnterEditMode = () => {
    setIsEditMode(true);
  };

  const handleExitEditMode = () => {
    setIsEditMode(false);
  };

  const handleChangePriority = (priorityValue) => {
    // Create a set of tag ids for this issue
    issuesExplorerContext.form.setFieldValue('priority', priorityValue);
  };

  //
  // C. Render components

  return (
    <>
      <Modal opened={isEditMode} onClose={handleExitEditMode} title={t('modal.title')} size="auto">
        {allPriorityDataFormatted.length > 0 ? (
          <div className={styles.listWrapper}>
            {allPriorityDataFormatted.map((priorityData) => (
              <div key={priorityData.value} className={`${styles.itemWrapper} ${priorityData.is_selected && styles.isSelected}`} onClick={() => handleChangePriority(priorityData.value)}>
                {priorityData.is_selected ? <IconCircleCheckFilled size={18} /> : <IconCircle size={18} />}
                <IssuesExplorerAttributePriority priority={priorityData.value} />
              </div>
            ))}
          </div>
        ) : (
          <NoDataLabel fill />
        )}
      </Modal>
      <div className={styles.container} onClick={handleEnterEditMode}>
        <IssuesExplorerAttributePriority priority={issuesExplorerContext.form.values.priority} />
      </div>
    </>
  );
}
