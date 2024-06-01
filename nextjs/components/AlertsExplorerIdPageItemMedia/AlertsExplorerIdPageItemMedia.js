'use client';

/* * */

import MediaExplorerMedia from '@/components/MediaExplorerMedia/MediaExplorerMedia';
import MediaExplorerMediaUpload from '@/components/MediaExplorerMediaUpload/MediaExplorerMediaUpload';
import { useAlertsExplorerContext } from '@/contexts/AlertsExplorerContext';
import { AlertOptions } from '@/schemas/Alert/options';

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
				{alertsExplorerContext.form.values.media
					? <MediaExplorerMedia key={alertsExplorerContext.form.values.media} mediaId={alertsExplorerContext.form.values.media} onDelete={handleMediaDelete} />
					: <MediaExplorerMediaUpload onUploadComplete={handleUploadComplete} storageScope={AlertOptions.storage_scope} />}
			</div>
		</div>
	);

	//
}
