'use client';

/* * */

import useSWR from 'swr';
import { useState } from 'react';
import API from '@/services/API';
import Loader from '@/components/Loader/Loader';
import Text from '@/components/Text/Text';
import MediaExplorerMediaPreviewImage from '@/components/MediaExplorerMediaPreviewImage/MediaExplorerMediaPreviewImage';
import MediaExplorerMediaPreviewPdf from '@/components/MediaExplorerMediaPreviewPdf/MediaExplorerMediaPreviewPdf';
import GlobalAuthorTimestamp from '@/components/GlobalAuthorTimestamp/GlobalAuthorTimestamp';
import { useTranslations } from 'next-intl';
import { ActionIcon, Box, Menu } from '@mantine/core';
import { IconDots, IconDownload, IconPencil, IconTrash } from '@tabler/icons-react';
import styles from './MediaExplorerMedia.module.css';
import { openConfirmModal } from '@mantine/modals';

/* * */

export default function MediaExplorerMedia({ mediaId, onDelete }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('MediaExplorerMedia');

  const [isDownloading, setIsDownloading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  //
  // B. Fetch data

  const { data: mediaData } = useSWR(mediaId && `/api/media/${mediaId}`);

  //
  // C. Handle actions

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const archiveBlob = await API({ service: 'media', resourceId: mediaId, operation: 'download', method: 'GET', parseType: 'blob' });
      const objectURL = URL.createObjectURL(archiveBlob);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.href = objectURL;
      downloadAnchor.download = `${mediaData.title}${mediaData.file_extension}`;
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      setIsDownloading(false);
    } catch (err) {
      console.log(err);
      setIsDownloading(false);
    }
  };

  const handleEdit = async () => {
    //
  };

  const handleDelete = async () => {
    openConfirmModal({
      title: <Text size="h2">{t('operations.delete.title')}</Text>,
      centered: true,
      closeOnClickOutside: true,
      children: <Text size="h3">{t('operations.delete.description')}</Text>,
      labels: { confirm: t('operations.delete.confirm'), cancel: t('operations.delete.cancel') },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          setIsDeleting(true);
          await API({ service: 'media', resourceId: mediaId, operation: 'delete', method: 'DELETE' });
          onDelete(mediaId);
          setIsDeleting(false);
        } catch (error) {
          console.log(error);
          setIsDeleting(false);
        }
      },
    });
  };

  //
  // D. Render components

  if (!mediaData) {
    return (
      <div className={styles.loadingContainer}>
        <Loader size={20} visible />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {isDeleting || isDownloading ? (
        <div className={styles.mediaPreview}>
          <Loader size={20} visible />
        </div>
      ) : (
        <div className={styles.mediaPreview}>
          {mediaData.file_mime_type === 'image/jpeg' && <MediaExplorerMediaPreviewImage mediaData={mediaData} />}
          {mediaData.file_mime_type === 'image/png' && <MediaExplorerMediaPreviewImage mediaData={mediaData} />}
          {mediaData.file_mime_type === 'application/pdf' && <MediaExplorerMediaPreviewPdf />}
        </div>
      )}
      <div className={styles.mediaDetails}>
        <div className={styles.titleAndDescription}>
          <p className={styles.title}>{mediaData.title}</p>
          {mediaData.description && <p className={styles.description}>{mediaData.description}</p>}
        </div>
        <GlobalAuthorTimestamp userId={mediaData.created_by} timestamp={mediaData.created_at} actionVerb={t('action_verb')} />
        <Menu trigger="hover" openDelay={300} closeDelay={100} shadow="md" position="right" withArrow>
          <Menu.Target>
            <Box className={styles.actionsTrigger}>
              <IconDots size={18} />
            </Box>
          </Menu.Target>
          <Menu.Dropdown p={0}>
            <div className={styles.actionsList}>
              <ActionIcon onClick={handleDownload} color="green" variant="subtle" size="lg">
                <IconDownload size={20} />
              </ActionIcon>
              <ActionIcon onClick={handleEdit} color="blue" variant="subtle" size="lg" disabled>
                <IconPencil size={20} />
              </ActionIcon>
              <ActionIcon onClick={handleDelete} color="red" variant="subtle" size="lg">
                <IconTrash size={20} />
              </ActionIcon>
            </div>
          </Menu.Dropdown>
        </Menu>
      </div>
    </div>
  );

  //
}
