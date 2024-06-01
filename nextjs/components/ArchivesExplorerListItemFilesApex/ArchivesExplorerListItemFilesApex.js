'use client';

/* * */

import ArchivesExplorerListItemFilesWrapper from '@/components/ArchivesExplorerListItemFilesWrapper/ArchivesExplorerListItemFilesWrapper';
import MediaExplorerMedia from '@/components/MediaExplorerMedia/MediaExplorerMedia';
import MediaExplorerMediaUpload from '@/components/MediaExplorerMediaUpload/MediaExplorerMediaUpload';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import { useArchivesExplorerItemContext } from '@/contexts/ArchivesExplorerItemContext';
import { ArchiveOptions } from '@/schemas/Archive/options';
import { useTranslations } from 'next-intl';

/* * */

export default function ArchivesExplorerListItemFilesApex() {
	//

	//
	// A. Setup variables

	const t = useTranslations('ArchivesExplorerListItemFilesApex');
	const archivesExplorerItemContext = useArchivesExplorerItemContext();

	//
	// B. Handle actions

	const handleUploadComplete = (result) => {
		if (result._id) {
			archivesExplorerItemContext.form.setFieldValue('apex_files', result._id);
		}
	};

	const handleMediaDelete = () => {
		archivesExplorerItemContext.form.setFieldValue('apex_files', null);
	};

	//
	// C. Render components

	if (archivesExplorerItemContext.form.values.apex_files) {
		return (
			<ArchivesExplorerListItemFilesWrapper title={t('title')}>
				<MediaExplorerMedia key={archivesExplorerItemContext.form.values.apex_files} mediaId={archivesExplorerItemContext.form.values.apex_files} onDelete={handleMediaDelete} readOnly={archivesExplorerItemContext.item.is_read_only || !archivesExplorerItemContext.item.is_edit_mode} />
			</ArchivesExplorerListItemFilesWrapper>
		);
	}

	if (!archivesExplorerItemContext.form.values.apex_files && (archivesExplorerItemContext.item.is_read_only || !archivesExplorerItemContext.item.is_edit_mode)) {
		return (
			<ArchivesExplorerListItemFilesWrapper title={t('title')}>
				<NoDataLabel />
			</ArchivesExplorerListItemFilesWrapper>
		);
	}

	return (
		<ArchivesExplorerListItemFilesWrapper title={t('title')}>
			<MediaExplorerMediaUpload onUploadComplete={handleUploadComplete} storageScope={ArchiveOptions.storage_scope} />
		</ArchivesExplorerListItemFilesWrapper>
	);

	//
}
