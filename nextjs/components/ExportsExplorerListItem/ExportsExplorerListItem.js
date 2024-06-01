'use client';

/* * */

import Loader from '@/components/Loader/Loader';
import API from '@/services/API';
import { Text } from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import { IconFileAlert, IconFileDownload, IconTrash } from '@tabler/icons-react';
import { useFormatter, useNow, useTranslations } from 'next-intl';
import { useState } from 'react';
import useSWR from 'swr';

import styles from './ExportsExplorerListItem.module.css';

/* * */

export default function ExportsExplorerListItem({ item }) {
	//

	//
	// A. Setup variables

	const t = useTranslations('ExportsExplorerListItem');
	const now = useNow({ updateInterval: 1000 });
	const format = useFormatter();
	const [isDownloading, setIsDownloading] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	//
	// B. Fetch data

	const { mutate: allExportsMutate } = useSWR('/api/exports');
	const { data: userData } = useSWR(item.exported_by && `/api/users/${item.exported_by}`);

	//
	// B. Handle actions

	const handleDeleteExport = async () => {
		openConfirmModal({
			centered: true,
			children: <Text size="sm">{t('operations.delete.description')}</Text>,
			closeOnClickOutside: true,
			confirmProps: { color: 'red' },
			labels: { cancel: t('operations.delete.cancel'), confirm: t('operations.delete.confirm') },
			onConfirm: async () => {
				try {
					setIsDeleting(true);
					await API({ method: 'DELETE', operation: 'delete', resourceId: item._id, service: 'exports' });
					allExportsMutate();
				}
				catch (error) {
					console.log(error);
					setIsDeleting(false);
				}
			},
			size: 'lg',
			title: t('operations.delete.title'),
		});
	};

	const handleExportDownload = async () => {
		try {
			setIsDownloading(true);
			const archiveBlob = await API({ method: 'GET', operation: 'download', parseType: 'blob', resourceId: item._id, service: 'exports' });
			const objectURL = URL.createObjectURL(archiveBlob);
			const zipDownload = document.createElement('a');
			zipDownload.href = objectURL;
			zipDownload.download = item.filename;
			document.body.appendChild(zipDownload);
			zipDownload.click();
			setIsDownloading(false);
		}
		catch (error) {
			console.log(error);
			setIsDownloading(false);
		}
	};

	//
	// C. Render components

	if (isDownloading) {
		return (
			<div className={`${styles.container} ${styles.downloading}`}>
				<div className={styles.mainSection}>
					<div className={styles.iconWrapper}>
						<Loader size={30} visible />
					</div>
					<div className={styles.infoWrapper}>
						<div className={styles.badgesWrapper}>
							<div className={`${styles.badge} ${styles.status}`}>{t(`kind.${item.kind}.label`)}</div>
							<div className={`${styles.badge} ${styles.status}`}>{t('status.DOWNLOADING')}</div>
						</div>
						<div className={styles.filename}>{item.filename || 'Untitled File'}</div>
						<div className={styles.exportedBy}>{t('exported_by', { name: (userData && userData.name) || '• • •', time: format.relativeTime(new Date(item.createdAt), now) })}</div>
					</div>
				</div>
			</div>
		);
	}

	if (isDeleting) {
		return (
			<div className={`${styles.container} ${styles.deleting}`}>
				<div className={styles.mainSection}>
					<div className={styles.iconWrapper}>
						<Loader size={30} visible />
					</div>
					<div className={styles.infoWrapper}>
						<div className={styles.badgesWrapper}>
							<div className={`${styles.badge} ${styles.status}`}>{t(`kind.${item.kind}.label`)}</div>
							<div className={`${styles.badge} ${styles.status}`}>{t('status.DOWNLOADING')}</div>
						</div>
						<div className={styles.filename}>{item.filename || 'Untitled File'}</div>
						<div className={styles.exportedBy}>{t('exported_by', { name: (userData && userData.name) || '• • •', time: format.relativeTime(new Date(item.createdAt), now) })}</div>
					</div>
				</div>
			</div>
		);
	}

	if (item.status === 'PROCESSING') {
		return (
			<div className={`${styles.container} ${styles.processing}`}>
				<div className={styles.mainSection}>
					<div className={styles.iconWrapper}>
						<Loader size={30} visible />
					</div>
					<div className={styles.infoWrapper}>
						<div className={styles.badgesWrapper}>
							<div className={styles.badge}>{t(`kind.${item.kind}.label`)}</div>
							<div className={styles.badge}>
								{t('status.PROCESSING')} {item.progress_current}/{item.progress_total}
							</div>
						</div>
						<div className={styles.filename}>{item.filename || 'Untitled File'}</div>
						<div className={styles.exportedBy}>{t('exported_by', { name: (userData && userData.name) || '• • •', time: format.relativeTime(new Date(item.createdAt), now) })}</div>
					</div>
				</div>
				<div className={styles.actionsSection} onClick={handleDeleteExport}>
					<IconTrash size={20} />
				</div>
			</div>
		);
	}

	if (item.status === 'COMPLETED') {
		return (
			<div className={`${styles.container} ${styles.completed}`}>
				<div className={styles.mainSection} onClick={handleExportDownload}>
					<div className={styles.iconWrapper}>
						<IconFileDownload size={50} stroke={1.5} />
					</div>
					<div className={styles.infoWrapper}>
						<div className={styles.badgesWrapper}>
							<div className={`${styles.badge} ${styles.status}`}>{t(`kind.${item.kind}.label`)}</div>
							<div className={`${styles.badge} ${styles.status}`}>{t('status.COMPLETED')}</div>
						</div>
						<div className={styles.filename}>{item.filename || 'Untitled File'}</div>
						<div className={styles.exportedBy}>{t('exported_by', { name: (userData && userData.name) || '• • •', time: format.relativeTime(new Date(item.createdAt), now) })}</div>
					</div>
				</div>
				<div className={styles.actionsSection} onClick={handleDeleteExport}>
					<IconTrash size={20} />
				</div>
			</div>
		);
	}

	if (item.status === 'ERROR') {
		return (
			<div className={`${styles.container} ${styles.error}`}>
				<div className={styles.mainSection}>
					<div className={styles.iconWrapper}>
						<IconFileAlert size={50} stroke={1.5} />
					</div>
					<div className={styles.infoWrapper}>
						<div className={styles.badgesWrapper}>
							<div className={`${styles.badge} ${styles.status}`}>{t(`kind.${item.kind}.label`)}</div>
							<div className={`${styles.badge} ${styles.status}`}>{t('status.ERROR')}</div>
						</div>
						<div className={styles.filename}>{item.filename || 'Untitled File'}</div>
						<div className={styles.exportedBy}>{t('exported_by', { name: (userData && userData.name) || '• • •', time: format.relativeTime(new Date(item.createdAt), now) })}</div>
					</div>
				</div>
				<div className={styles.actionsSection} onClick={handleDeleteExport}>
					<IconTrash size={20} />
				</div>
			</div>
		);
	}

	//
}
