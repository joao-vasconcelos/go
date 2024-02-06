'use client';

/* * */

import Loader from '@/components/Loader/Loader';
import { useState } from 'react';
import { Button, FileInput, Modal, TextInput } from '@mantine/core';
import styles from './MediaExplorerMediaUpload.module.css';
import API from '@/services/API';

/* * */

export default function MediaExplorerMediaUpload({ onUploadComplete }) {
  //

  //
  // A. Setup variables

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [value, setValue] = useState();
  const [isUploading, setIsUploading] = useState(false);

  //
  // B. Render components

  const handleUpload = async () => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', value);
      formData.append('title', title);
      const result = await API({ service: 'media', operation: 'create', method: 'POST', body: formData, bodyType: 'raw' });
      onUploadComplete(result);
      setIsUploading(false);
    } catch (err) {
      console.log(err);
      setIsUploading(false);
    }
  };

  //
  // B. Render components

  return (
    <>
      <Modal opened={modalIsOpen} onClose={() => setModalIsOpen(false)} title="Upload">
        <div className={styles.container}>
          <TextInput value={title} onChange={({ currentTarget }) => setTitle(currentTarget.value)} w="100%" />
          <FileInput value={value} onChange={setValue} w="100%" />
          <Button onClick={handleUpload}>Upload</Button>
        </div>
      </Modal>
      <Button onClick={() => setModalIsOpen(true)}>Upload</Button>
    </>
  );

  //
}
