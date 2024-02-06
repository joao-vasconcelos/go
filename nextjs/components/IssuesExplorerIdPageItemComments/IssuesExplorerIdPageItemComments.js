'use client';

/* * */

import { useTranslations } from 'next-intl';
import { useIssuesExplorerContext } from '@/contexts/IssuesExplorerContext';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import IssuesExplorerAttributeComment from '@/components/IssuesExplorerAttributeComment/IssuesExplorerAttributeComment';
import styles from './IssuesExplorerIdPageItemComments.module.css';
import IssuesExplorerIdPageItemCommentsAddComment from '@/components/IssuesExplorerIdPageItemCommentsAddComment/IssuesExplorerIdPageItemCommentsAddComment';

/* * */

export default function IssuesExplorerIdPageItemComments() {
  //

  //
  // A. Setup variables

  const t = useTranslations('IssuesExplorerIdPageItemComments');
  const issuesExplorerContext = useIssuesExplorerContext();

  //
  // B. Render components

  return (
    <div className={styles.container}>
      {issuesExplorerContext.form.values.comments.length > 0 ? (
        <div className={styles.commentsWrapper}>
          {issuesExplorerContext.form.values.comments.map((itemData, index) => (
            <IssuesExplorerAttributeComment key={index} commentData={itemData} />
          ))}
        </div>
      ) : (
        <NoDataLabel />
      )}
      <IssuesExplorerIdPageItemCommentsAddComment />
    </div>
  );
}
