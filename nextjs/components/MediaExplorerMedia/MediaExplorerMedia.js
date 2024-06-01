'use client';

/* * */

import GlobalAuthorTimestamp from '@/components/GlobalAuthorTimestamp/GlobalAuthorTimestamp';
import Loader from '@/components/Loader/Loader';
import MediaExplorerMediaPreviewImage from '@/components/MediaExplorerMediaPreviewImage/MediaExplorerMediaPreviewImage';
import MediaExplorerMediaPreviewPdf from '@/components/MediaExplorerMediaPreviewPdf/MediaExplorerMediaPreviewPdf';
import MediaExplorerMediaPreviewZip from '@/components/MediaExplorerMediaPreviewZip/MediaExplorerMediaPreviewZip';
import Text from '@/components/Text/Text';
import API from '@/services/API';
import { ActionIcon, Box, Menu } from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import { IconDots, IconDownload, IconPencil, IconTrash } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import useSWR from 'swr';

import styles from './MediaExplorerMedia.module.css';

/* * */

export default function MediaExplorerMedia({ mediaId, onDelete, readOnly = false }) {
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
			const archiveBlob = await API({ method: 'GET', operation: 'download', parseType: 'blob', resourceId: mediaId, service: 'media' });
			const objectURL = URL.createObjectURL(archiveBlob);
			const downloadAnchor = document.createElement('a');
			downloadAnchor.href = objectURL;
			downloadAnchor.download = `${mediaData.title}${mediaData.file_extension}`;
			document.body.appendChild(downloadAnchor);
			downloadAnchor.click();
			setIsDownloading(false);
		}
		catch (error) {
			console.log(error);
			setIsDownloading(false);
		}
	};

	const handleEdit = async () => {
		//
	};

	const handleDelete = async () => {
		openConfirmModal({
			centered: true,
			children: <Text size="h3">{t('operations.delete.description')}</Text>,
			closeOnClickOutside: true,
			confirmProps: { color: 'red' },
			labels: { cancel: t('operations.delete.cancel'), confirm: t('operations.delete.confirm') },
			onConfirm: async () => {
				try {
					setIsDeleting(true);
					await API({ method: 'DELETE', operation: 'delete', resourceId: mediaId, service: 'media' });
					onDelete(mediaId);
					setIsDeleting(false);
				}
				catch (error) {
					console.log(error);
					setIsDeleting(false);
				}
			},
			title: <Text size="h2">{t('operations.delete.title')}</Text>,
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
			{isDeleting || isDownloading
				? (
					<div className={styles.mediaPreview}>
						<Loader size={20} visible />
					</div>
				)
				: (
					<div className={styles.mediaPreview}>
						{mediaData.file_mime_type === 'image/jpeg' && <MediaExplorerMediaPreviewImage mediaData={mediaData} />}
						{mediaData.file_mime_type === 'image/png' && <MediaExplorerMediaPreviewImage mediaData={mediaData} />}
						{mediaData.file_mime_type === 'application/pdf' && <MediaExplorerMediaPreviewPdf />}
						{mediaData.file_mime_type === 'application/zip' && <MediaExplorerMediaPreviewZip />}
						{mediaData.file_mime_type === 'application/x-zip-compressed' && <MediaExplorerMediaPreviewZip />}
					</div>
				)}
			<div className={styles.mediaDetails}>
				<div className={styles.titleAndDescription}>
					<p className={styles.title}>{mediaData.title}</p>
					{mediaData.description && <p className={styles.description}>{mediaData.description}</p>}
				</div>
				<GlobalAuthorTimestamp actionVerb={t('action_verb')} timestamp={mediaData.created_at} userId={mediaData.created_by} />
				{!readOnly
				&& (
					<Menu closeDelay={100} openDelay={300} position="right" shadow="md" trigger="hover" withArrow>
						<Menu.Target>
							<Box className={styles.actionsTrigger}>
								<IconDots size={18} />
							</Box>
						</Menu.Target>
						<Menu.Dropdown p={0}>
							<div className={styles.actionsList}>
								<ActionIcon color="green" onClick={handleDownload} size="lg" variant="subtle">
									<IconDownload size={20} />
								</ActionIcon>
								<ActionIcon color="blue" onClick={handleEdit} size="lg" variant="subtle" disabled>
									<IconPencil size={20} />
								</ActionIcon>
								<ActionIcon color="red" onClick={handleDelete} size="lg" variant="subtle">
									<IconTrash size={20} />
								</ActionIcon>
							</div>
						</Menu.Dropdown>
					</Menu>
				)}
			</div>
		</div>
	);

	//
}
