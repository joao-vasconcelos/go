'use client';

/* * */

import useSWR from 'swr';
import { useMemo, useState } from 'react';
import { ActionIcon, Button, Select } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useIssuesExplorerContext } from '@/contexts/IssuesExplorerContext';
import styles from './IssuesExplorerIdPageItemIssues.module.css';
import { IssuesExplorerIssue } from '../IssuesExplorerIssue/IssuesExplorerIssue';
import { IconTrash } from '@tabler/icons-react';

/* * */

export default function IssuesExplorerIdPageItemIssues() {
  //

  //
  // A. Setup variables

  const t = useTranslations('IssuesExplorerIdPageItemIssues');
  const issuesExplorerContext = useIssuesExplorerContext();

  const [selectedIssueId, setSelectedIssueId] = useState(null);

  //
  // B. Fetch data

  const { data: allIssuesData } = useSWR('/api/issues');

  //
  // C. Transform data

  const allIssuesDataFormatted = useMemo(() => {
    // Exit if no data is available
    if (!allIssuesData) return [];
    // For each issue check if it related with the current issue or not
    return allIssuesData.map((issue) => ({ value: issue._id, label: `[${issue.code}] ${issue.title}` }));
    //
  }, [allIssuesData]);

  //
  // D. Handle actions

  const handleAddRelatedIssue = () => {
    issuesExplorerContext.toggleRelatedIssue(selectedIssueId);
    setSelectedIssueId(null);
  };

  const handleRemoveRelatedIssue = (issueId) => {
    issuesExplorerContext.toggleRelatedIssue(issueId);
  };

  //
  // E. Render components

  return (
    <div className={styles.container}>
      <div className={styles.list}>
        {issuesExplorerContext.form.values.related_issues.length > 0 &&
          issuesExplorerContext.form.values.related_issues.map((issueId) => (
            <div key={issueId} className={styles.itemWrapper}>
              <IssuesExplorerIssue issueId={issueId} />
              {!issuesExplorerContext.page.is_read_only && (
                <ActionIcon onClick={() => handleRemoveRelatedIssue(issueId)} variant="light" color="red">
                  <IconTrash size={20} />
                </ActionIcon>
              )}
            </div>
          ))}
      </div>
      {!issuesExplorerContext.page.is_read_only && (
        <>
          <Select
            label={t('related_issues.label')}
            placeholder={t('related_issues.placeholder')}
            nothingFoundMessage={t('related_issues.nothingFound')}
            data={allIssuesDataFormatted}
            value={selectedIssueId}
            onChange={setSelectedIssueId}
            limit={100}
            w="100%"
            readOnly={issuesExplorerContext.page.is_read_only}
            searchable
          />
          <Button onClick={handleAddRelatedIssue} disabled={!selectedIssueId || issuesExplorerContext.page.is_read_only}>
            Add Related Issue
          </Button>
        </>
      )}
    </div>
  );
}
