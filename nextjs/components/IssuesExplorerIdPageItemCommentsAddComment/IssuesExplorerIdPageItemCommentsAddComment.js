'use client';

/* * */

import { useTranslations } from 'next-intl';
import { useIssuesExplorerContext } from '@/contexts/IssuesExplorerContext';
import styles from './IssuesExplorerIdPageItemCommentsAddComment.module.css';
import { Button, Textarea } from '@mantine/core';
import { useState } from 'react';

/* * */

export default function IssuesExplorerIdPageItemCommentsAddComment() {
  //

  //
  // A. Setup variables

  const t = useTranslations('IssuesExplorerIdPageItemCommentsAddComment');
  const issuesExplorerContext = useIssuesExplorerContext();

  const [commentText, setCommentText] = useState('');

  //
  // B. Render components

  const handleAddComment = () => {
    issuesExplorerContext.addComment(commentText);
  };

  //
  // B. Render components

  return (
    <div className={styles.container}>
      <Textarea w="100%" value={commentText} onChange={({ currentTarget }) => setCommentText(currentTarget.value)} />
      <Button onClick={handleAddComment}>Publicar Comentário</Button>
    </div>
  );
}
