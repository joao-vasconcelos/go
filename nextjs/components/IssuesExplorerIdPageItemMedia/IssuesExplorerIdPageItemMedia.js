'use client';

/* * */

import { useTranslations } from 'next-intl';
import styles from './IssuesExplorerIdPageItemMedia.module.css';
import { useIssuesExplorerContext } from '@/contexts/IssuesExplorerContext';
import MediaExplorerMediaUpload from '../MediaExplorerMediaUpload/MediaExplorerMediaUpload';
import MediaExplorerMedia from '../MediaExplorerMedia/MediaExplorerMedia';

/* * */

export default function IssuesExplorerIdPageItemMedia() {
  //

  //
  // A. Setup variables

  const t = useTranslations('IssuesExplorerIdPageItemMedia');
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
      <div className={styles.mediaList}>
        {issuesExplorerContext.form.values.media.map((mediaId) => (
          <MediaExplorerMedia key={mediaId} mediaId={mediaId} onDelete={handleMediaDelete} />
        ))}
        <MediaExplorerMediaUpload onUploadComplete={handleUploadComplete} />
      </div>
    </div>
  );
}
