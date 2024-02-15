'use client';

/* * */

import useSWR from 'swr';
import styles from './IssuesExplorerIssue.module.css';
import Loader from '@/components/Loader/Loader';

/* * */

export function IssuesExplorerIssue({ issueId }) {
  //

  //
  // A. Fetch data

  const { data: issueData } = useSWR(issueId && `/api/issues/${issueId}`);

  //
  // B. Handle actions

  const handleOpenIssue = () => {
    window.open(`/issues/${issueId}`, '_blank');
  };

  //
  // C. Render components

  return issueData ? (
    <div className={styles.container} onClick={handleOpenIssue}>
      <div className={styles.badge}>#{issueData.code}</div>
      <div className={styles.name}>{issueData.title}</div>
    </div>
  ) : (
    <Loader size={10} visible />
  );

  //
}
