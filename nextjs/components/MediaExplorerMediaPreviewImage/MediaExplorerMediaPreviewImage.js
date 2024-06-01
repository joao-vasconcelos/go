'use client';

/* * */

import Loader from '@/components/Loader/Loader';
import API from '@/services/API';
import { Modal } from '@mantine/core';
import Image from 'next/image';
import { useEffect, useState } from 'react';

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
				const result = await API({ method: 'GET', operation: 'preview', parseType: 'blob', resourceId: mediaData._id, service: 'media' });
				const url = URL.createObjectURL(result);
				setPreviewUrl(url);
			}
			catch (error) {
				console.log(error);
			}
		})();
	}, [mediaData]);

	//
	// B. Render components

	return (
		<>
			<Modal onClose={() => setModalIsOpen(false)} opened={modalIsOpen} padding={0} size="80%" withCloseButton={false}>
				<div className={styles.modalPreview}>
					<Image alt={mediaData.title} sizes="500px" src={previewUrl} style={{ objectFit: 'contain' }} fill />
				</div>
			</Modal>
			{previewUrl
				? (
					<div className={styles.container} onClick={() => setModalIsOpen(true)}>
						<Image alt={mediaData.title} sizes="500px" src={previewUrl} style={{ objectFit: 'cover' }} fill />{' '}
					</div>
				)
				: (
					<div className={styles.container} style={{ cursor: 'progress' }}>
						<Loader size={20} visible />
					</div>
				)}
		</>
	);

	//
}
