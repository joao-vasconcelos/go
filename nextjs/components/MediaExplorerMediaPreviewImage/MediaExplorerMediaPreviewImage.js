'use client';

/* * */

import API from '@/services/API';
import Image from 'next/image';
import { Modal } from '@mantine/core';
import { useEffect, useState } from 'react';
import Loader from '@/components/Loader/Loader';
import styles from './MediaExplorerMediaPreviewImage.module.css';

/* * */

export default function MediaExplorerMediaPreviewImage({ mediaData }) {
  //

  //
  // A. Fetch data

  const [previewUrl, setPreviewUrl] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  //
  // B. Render components

  useEffect(() => {
    (async () => {
      try {
        if (!mediaData || !mediaData.file_mime_type.includes('image')) return;
        const result = await API({ service: 'media', resourceId: mediaData._id, operation: 'preview', method: 'GET', parseType: 'blob' });
        const url = URL.createObjectURL(result);
        setPreviewUrl(url);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [mediaData]);

  //
  // B. Render components

  return (
    <>
      <Modal opened={modalIsOpen} onClose={() => setModalIsOpen(false)} size="80%" withCloseButton={false} padding={0}>
        <div className={styles.modalPreview}>
          <Image src={previewUrl} alt={mediaData.title} sizes="500px" fill style={{ objectFit: 'contain' }} />
        </div>
      </Modal>
      {previewUrl ? (
        <div className={styles.container} onClick={() => setModalIsOpen(true)}>
          <Image src={previewUrl} alt={mediaData.title} sizes="500px" fill style={{ objectFit: 'cover' }} />{' '}
        </div>
      ) : (
        <div className={styles.container} style={{ cursor: 'progress' }}>
          <Loader size={20} visible />
        </div>
      )}
    </>
  );

  //
}
