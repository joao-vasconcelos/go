'use client';

/* * */

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button, Modal, SimpleGrid, TextInput, Textarea } from '@mantine/core';
import { useIssuesExplorerContext } from '@/contexts/IssuesExplorerContext';
import styles from './IssuesExplorerIdPageItemTitle.module.css';

/* * */

export default function IssuesExplorerIdPageItemTitle() {
  //

  //
  // A. Setup variables

  const t = useTranslations('IssuesExplorerIdPageItemTitle');
  const issuesExplorerContext = useIssuesExplorerContext();
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (!issuesExplorerContext.form.values.title) setIsEditMode(true);
  }, [issuesExplorerContext.form.values.title]);

  //
  // B. Handle actions

  const handleEnterEditMode = () => {
    setIsEditMode(true);
  };

  const handleExitEditMode = () => {
    if (!issuesExplorerContext.form.values.title) return;
    setIsEditMode(false);
  };

  //
  // C. Render components

  return (
    <>
      <Modal opened={isEditMode} onClose={handleExitEditMode} title={t('modal.title')} size={600}>
        <SimpleGrid cols={1}>
          <TextInput label={t('modal.fields.title.label')} placeholder={t('modal.fields.title.placeholder')} {...issuesExplorerContext.form.getInputProps('title')} readOnly={issuesExplorerContext.page.is_read_only} />
          <Textarea label={t('modal.fields.summary.label')} placeholder={t('modal.fields.summary.placeholder')} {...issuesExplorerContext.form.getInputProps('summary')} readOnly={issuesExplorerContext.page.is_read_only} minRows={5} autosize />
        </SimpleGrid>
      </Modal>
      <div className={styles.container}>
        <div className={styles.bylineWrapper}>
          <p className={styles.code}>#{issuesExplorerContext.form.values.code}</p>
          <Button variant="subtle" size="compact-xs" color="gray" onClick={handleEnterEditMode}>
            {t('edit.label')}
          </Button>
        </div>
        <h2 className={styles.title}>{issuesExplorerContext.form.values.title || 'untitled'}</h2>
        <p className={styles.summary}>{issuesExplorerContext.form.values.summary || 'untitled'}</p>
      </div>
    </>
  );
}
