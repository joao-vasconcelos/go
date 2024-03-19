'use client';

/* * */

import { ArchiveOptions } from '@/schemas/Archive/options';
import MediaExplorerMediaUpload from '@/components/MediaExplorerMediaUpload/MediaExplorerMediaUpload';
import MediaExplorerMedia from '@/components/MediaExplorerMedia/MediaExplorerMedia';
import { useArchivesExplorerItemContext } from '@/contexts/ArchivesExplorerItemContext';
import ArchivesExplorerListItemFilesWrapper from '@/components/ArchivesExplorerListItemFilesWrapper/ArchivesExplorerListItemFilesWrapper';
import NoDataLabel from '@/components/NoDataLabel/NoDataLabel';
import { useTranslations } from 'next-intl';

/* * */

export default function ArchivesExplorerListItemFilesReference() {
  //

  //
  // A. Setup variables

  const t = useTranslations('ArchivesExplorerListItemFilesReference');
  const archivesExplorerItemContext = useArchivesExplorerItemContext();

  //
  // B. Handle actions

  const handleUploadComplete = (result) => {
    if (result._id) {
      archivesExplorerItemContext.form.setFieldValue('reference_plan', result._id);
    }
  };

  const handleMediaDelete = () => {
    archivesExplorerItemContext.form.setFieldValue('reference_plan', null);
  };

  //
  // C. Render components

  if (archivesExplorerItemContext.form.values.reference_plan) {
    return (
      <ArchivesExplorerListItemFilesWrapper title={t('title')}>
        <MediaExplorerMedia key={archivesExplorerItemContext.form.values.reference_plan} mediaId={archivesExplorerItemContext.form.values.reference_plan} onDelete={handleMediaDelete} readOnly={archivesExplorerItemContext.item.is_read_only || !archivesExplorerItemContext.item.is_edit_mode} />
      </ArchivesExplorerListItemFilesWrapper>
    );
  }

  if (!archivesExplorerItemContext.form.values.reference_plan && (archivesExplorerItemContext.item.is_read_only || !archivesExplorerItemContext.item.is_edit_mode)) {
    return (
      <ArchivesExplorerListItemFilesWrapper title={t('title')}>
        <NoDataLabel />
      </ArchivesExplorerListItemFilesWrapper>
    );
  }

  return (
    <ArchivesExplorerListItemFilesWrapper title={t('title')}>
      <MediaExplorerMediaUpload storageScope={ArchiveOptions.storage_scope} onUploadComplete={handleUploadComplete} />
    </ArchivesExplorerListItemFilesWrapper>
  );

  //
}
