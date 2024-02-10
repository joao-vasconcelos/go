'use client';

/* * */

import API from '@/services/API';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { IconUpload } from '@tabler/icons-react';
import { Alert, Button, FileInput, Modal, TextInput, Textarea } from '@mantine/core';
import styles from './MediaExplorerMediaUpload.module.css';

/* * */

export default function MediaExplorerMediaUpload({ storageScope, onUploadComplete }) {
  //

  //
  // A. Setup variables

  const t = useTranslations('MediaExplorerMediaUpload');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formFile, setFormFile] = useState();
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadError, setIsUploadError] = useState(false);

  //
  // B. Handle actions

  const handleToggleModal = async () => {
    if (isUploading) return;
    setIsModalOpen((prev) => !prev);
  };

  const handleUpload = async () => {
    try {
      setIsUploading(true);
      setIsUploadError(null);
      const formData = new FormData();
      formData.append('storage_scope', storageScope);
      formData.append('file', formFile);
      formData.append('title', formTitle);
      formData.append('description', formDescription);
      const result = await API({ service: 'media', operation: 'create', method: 'POST', body: formData, bodyType: 'raw' });
      setFormFile(null);
      setFormTitle('');
      setFormDescription('');
      setIsModalOpen(false);
      setIsUploading(false);
      // Callback
      onUploadComplete(result);
    } catch (err) {
      console.log(err);
      setIsUploading(false);
      setIsUploadError(err.message || t('upload_error.description'));
    }
  };

  //
  // C. Render components

  return (
    <>
      <Modal opened={isModalOpen} onClose={handleToggleModal} withCloseButton={false}>
        <div className={styles.formWrapper}>
          {isUploadError && (
            <Alert title={t('upload_error.title')} color="red">
              {isUploadError}
            </Alert>
          )}
          <FileInput label={t('form.file.label')} placeholder={t('form.file.placeholder')} value={formFile} onChange={setFormFile} disabled={isUploading} clearable />
          <TextInput label={t('form.title.label')} placeholder={t('form.title.placeholder')} value={formTitle} onChange={({ currentTarget }) => setFormTitle(currentTarget.value)} disabled={isUploading} />
          <Textarea label={t('form.description.label')} placeholder={t('form.description.placeholder')} value={formDescription} onChange={({ currentTarget }) => setFormDescription(currentTarget.value)} minRows={3} autosize disabled={isUploading} />
          <Button onClick={handleUpload} loading={isUploading} disabled={!formFile || !formTitle}>
            {t('form.submit.label')}
          </Button>
          <Button onClick={handleToggleModal} disabled={isUploading} variant="subtle" color="red">
            {t('form.close.label')}
          </Button>
        </div>
      </Modal>
      <div className={styles.container} onClick={handleToggleModal}>
        <IconUpload />
        <p className={styles.label}>{t('form.submit.label')}</p>
      </div>
    </>
  );

  //
}
