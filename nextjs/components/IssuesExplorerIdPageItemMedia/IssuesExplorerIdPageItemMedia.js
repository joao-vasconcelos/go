'use client';

/* * */

import { useTranslations } from 'next-intl';
import { Button, Modal, SimpleGrid, TextInput } from '@mantine/core';
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
    // issuesExplorerContext.form.removeListItem('media');
  };

  //
  // B. Render components

  return (
    <div>
      <SimpleGrid cols={5}>
        {issuesExplorerContext.form.values.media.map((mediaId) => (
          <MediaExplorerMedia key={mediaId} mediaId={mediaId} onDelete={handleMediaDelete} />
        ))}
      </SimpleGrid>
      <MediaExplorerMediaUpload onUploadComplete={handleUploadComplete} />
    </div>
  );
}
