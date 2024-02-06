'use client';

/* * */

import useSWR from 'swr';
import Loader from '@/components/Loader/Loader';
import styles from './MediaExplorerMedia.module.css';
import { IconPencil } from '@tabler/icons-react';
import Image from 'next/image';
import { useEffect, useMemo } from 'react';
import API from '@/services/API';

/* * */

export default function MediaExplorerMedia({ mediaId, onDelete }) {
  //

  //
  // A. Fetch data

  const { data: mediaData } = useSWR(mediaId && `/api/media/${mediaId}`);

  //
  // B. Render components

  const mediaPreview = useMemo(async () => {
    try {
      if (!mediaData) return;
      const result = await API({ service: 'media', resourceId: mediaId, operation: 'preview', method: 'GET', parseType: 'blob' });
      return result;
    } catch (error) {
      console.log(error);
    }
  }, []);

  //
  // B. Render components

  if (!mediaData) {
    return (
      <div className={styles.container}>
        <Loader size={15} visible />
      </div>
    );
  }

  switch (mediaData.file_mime_type) {
    case 'image/jpeg':
      return (
        <div className={`${styles.container} ${styles.draft}`}>
          <IconPencil size={14} />
          {mediaPreview && <Image src={mediaPreview} width={100} height={100} alt="" />}
        </div>
      );
  }

  //
}
