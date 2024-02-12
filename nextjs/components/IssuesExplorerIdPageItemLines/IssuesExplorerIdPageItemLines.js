'use client';

/* * */

import styles from './IssuesExplorerIdPageItemLines.module.css';
import { useIssuesExplorerContext } from '@/contexts/IssuesExplorerContext';
import MediaExplorerMediaUpload from '@/components/MediaExplorerMediaUpload/MediaExplorerMediaUpload';
import MediaExplorerMedia from '@/components/MediaExplorerMedia/MediaExplorerMedia';
import { IssueOptions } from '@/schemas/Issue/options';
import { MultiSelect } from '@mantine/core';

/* * */

export default function IssuesExplorerIdPageItemLines() {
  //

  //
  // A. Setup variables

  const issuesExplorerContext = useIssuesExplorerContext();

  //
  // B. Render components

  const handleUploadComplete = (result) => {
    if (result._id) issuesExplorerContext.form.insertListItem('media', result._id);
  };

  const handleMediaDelete = (mediaId) => {
    const index = issuesExplorerContext.form.values.media.indexOf(mediaId);
    if (index > -1) issuesExplorerContext.form.removeListItem('media', index);
  };

  //
  // B. Render components

  return (
    <div className={styles.container}>
      <MultiSelect />
    </div>
  );
}
