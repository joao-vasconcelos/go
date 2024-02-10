'use client';

/* * */

import { AlertOptions } from '@/schemas/Alert/options';
import { useAlertsExplorerContext } from '@/contexts/AlertsExplorerContext';
import MediaExplorerMediaUpload from '@/components/MediaExplorerMediaUpload/MediaExplorerMediaUpload';
import MediaExplorerMedia from '@/components/MediaExplorerMedia/MediaExplorerMedia';
import styles from './AlertsExplorerIdPageItemMedia.module.css';

/* * */

export default function AlertsExplorerIdPageItemMedia() {
  //

  //
  // A. Setup variables

  const alertsExplorerContext = useAlertsExplorerContext();

  //
  // B. Handle actions

  const handleUploadComplete = (result) => {
    if (result._id) alertsExplorerContext.form.setFieldValue('media', result._id);
  };

  const handleMediaDelete = () => {
    alertsExplorerContext.form.setFieldValue('media', null);
  };

  //
  // C. Render components

  return (
    <div className={styles.container}>
      <div className={styles.mediaList}>
        {alertsExplorerContext.form.values.media ? (
          <MediaExplorerMedia key={alertsExplorerContext.form.values.media} mediaId={alertsExplorerContext.form.values.media} onDelete={handleMediaDelete} />
        ) : (
          <MediaExplorerMediaUpload storageScope={AlertOptions.storage_scope} onUploadComplete={handleUploadComplete} />
        )}
      </div>
    </div>
  );

  //
}
