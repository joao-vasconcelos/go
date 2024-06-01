'use client';

/* * */

import API from '@/services/API';
import { Alert, Button, FileInput, Modal, TextInput, Textarea } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import styles from './MediaExplorerMediaUpload.module.css';

/* * */

export default function MediaExplorerMediaUpload({ disabled = false, onUploadComplete, storageScope }) {
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
		if (isUploading || disabled) return;
		setIsModalOpen(prev => !prev);
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
			const result = await API({ body: formData, bodyType: 'raw', method: 'POST', operation: 'create', service: 'media' });
			setFormFile(null);
			setFormTitle('');
			setFormDescription('');
			setIsModalOpen(false);
			setIsUploading(false);
			// Callback
			onUploadComplete(result);
		}
		catch (error) {
			console.log(error);
			setIsUploading(false);
			setIsUploadError(error.message || t('upload_error.description'));
		}
	};

	//
	// C. Render components

	return (
		<>
			<Modal onClose={handleToggleModal} opened={isModalOpen} withCloseButton={false}>
				<div className={styles.formWrapper}>
					{isUploadError
					&& (
						<Alert color="red" title={t('upload_error.title')}>
							{isUploadError}
						</Alert>
					)}
					<FileInput disabled={isUploading} label={t('form.file.label')} onChange={setFormFile} placeholder={t('form.file.placeholder')} value={formFile} clearable />
					<TextInput disabled={isUploading} label={t('form.title.label')} onChange={({ currentTarget }) => setFormTitle(currentTarget.value)} placeholder={t('form.title.placeholder')} value={formTitle} />
					<Textarea disabled={isUploading} label={t('form.description.label')} minRows={3} onChange={({ currentTarget }) => setFormDescription(currentTarget.value)} placeholder={t('form.description.placeholder')} value={formDescription} autosize />
					<Button disabled={!formFile || !formTitle} loading={isUploading} onClick={handleUpload}>
						{t('form.submit.label')}
					</Button>
					<Button color="red" disabled={isUploading} onClick={handleToggleModal} variant="subtle">
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
