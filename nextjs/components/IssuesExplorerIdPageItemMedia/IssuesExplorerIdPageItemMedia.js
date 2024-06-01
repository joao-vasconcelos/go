'use client';

/* * */

import MediaExplorerMedia from '@/components/MediaExplorerMedia/MediaExplorerMedia';
import MediaExplorerMediaUpload from '@/components/MediaExplorerMediaUpload/MediaExplorerMediaUpload';
import { useIssuesExplorerContext } from '@/contexts/IssuesExplorerContext';
import { IssueOptions } from '@/schemas/Issue/options';

import styles from './IssuesExplorerIdPageItemMedia.module.css';

/* * */

export default function IssuesExplorerIdPageItemMedia() {
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
			<div className={styles.mediaList}>
				{issuesExplorerContext.form.values.media.map(mediaId => <MediaExplorerMedia key={mediaId} mediaId={mediaId} onDelete={handleMediaDelete} readOnly={issuesExplorerContext.page.is_read_only} />)}
				{!issuesExplorerContext.page.is_read_only && <MediaExplorerMediaUpload onUploadComplete={handleUploadComplete} storageScope={IssueOptions.storage_scope} />}
			</div>
		</div>
	);
}
