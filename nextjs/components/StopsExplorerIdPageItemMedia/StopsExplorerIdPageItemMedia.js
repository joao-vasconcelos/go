'use client';

/* * */

import styles from './StopsExplorerIdPageItemMedia.module.css';
import { useStopsExplorerContext } from '@/contexts/StopsExplorerContext';
import MediaExplorerMediaUpload from '@/components/MediaExplorerMediaUpload/MediaExplorerMediaUpload';
import MediaExplorerMedia from '@/components/MediaExplorerMedia/MediaExplorerMedia';
import { StopOptions } from '@/schemas/Stop/options';

/* * */

export default function StopsExplorerIdPageItemMedia() {
	//

	//
	// A. Setup variables

	const stopsExplorerContext = useStopsExplorerContext();

	//
	// B. Render components

	const handleUploadComplete = (result) => {
		if (result._id) stopsExplorerContext.form.insertListItem('media', result._id);
	};

	const handleMediaDelete = (mediaId) => {
		const index = stopsExplorerContext.form.values.media.indexOf(mediaId);
		if (index > -1) stopsExplorerContext.form.removeListItem('media', index);
	};

	//
	// B. Render components

	return (
		<div className={styles.container}>
			<div className={styles.mediaList}>
				{stopsExplorerContext.form.values.media.map((mediaId) => <MediaExplorerMedia key={mediaId} mediaId={mediaId} onDelete={handleMediaDelete} readOnly={stopsExplorerContext.page.is_read_only} />)}
				{!stopsExplorerContext.page.is_read_only && <MediaExplorerMediaUpload storageScope={StopOptions.storage_scope} onUploadComplete={handleUploadComplete} />}
			</div>
		</div>
	);
}