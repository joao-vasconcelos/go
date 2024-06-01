'use client';

import { Alert, Button } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { IconAlertTriangleFilled, IconBan, IconDragDrop, IconUpload } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';

import Loader from '../Loader/Loader';
import Pannel from '../Pannel/Pannel';
import Text from '../Text/Text';
import styles from './BulkImportFileSelect.module.css';

export default function BulkImportFileSelect({ filesParser, onParse }) {
	//

	//
	// A. Setup variables

	const t = useTranslations('BulkImportFileSelect');
	const openFileBrowserRef = useRef(null);
	const [isParsing, setIsParsing] = useState(false);
	const [hasParsingError, setHasParsingError] = useState(false);

	//
	// B. Handle actions

	const handleAcceptedFilesDrop = async (acceptedFiles) => {
		try {
			// Update the UI to reflect parsing init
			setIsParsing(true);
			setHasParsingError();
			// Parse the files using the provided parser
			const parsedData = await filesParser(acceptedFiles);
			// Update the UI to reflect parsing end
			// and pass the result to the next handler
			setIsParsing(false);
			onParse(parsedData);
			//
		}
		catch (error) {
			setHasParsingError(error.message);
			setIsParsing(false);
		}
	};

	const handleRejectedFilesDrop = (rejectedFiles) => {
		return;
	};

	//
	// C. Render components

	const ErrorAlert = () => (
		<Alert color="red" icon={<IconAlertTriangleFilled size="20px" />} title={t('parsing_error.title')}>
			{hasParsingError || t('parsing_error.description')}
		</Alert>
	);
	const DropZoneIdle = () => (
		<div className={styles.container} onClick={() => openFileBrowserRef.current()}>
			<IconDragDrop size="60px" />
			<Text size="h1">{t('dropzone.idle.title')}</Text>
			<Text size="h3">{t('dropzone.idle.description')}</Text>
		</div>
	);
	const DropZoneAccept = () => (
		<Dropzone.Accept>
			<div className={styles.container}>
				<IconUpload size="60px" />
				<Text size="h1">{t('dropzone.accept.title')}</Text>
				<Text size="h3">{t('dropzone.accept.description')}</Text>
			</div>
		</Dropzone.Accept>
	);
	const DropZoneReject = () => (
		<Dropzone.Reject>
			<div className={styles.container}>
				<IconBan size="60px" />
				<Text size="xl">{t('dropzone.reject.title')}</Text>
				<Text size="h3">{t('dropzone.reject.description')}</Text>
			</div>
		</Dropzone.Reject>
	);
	return (
		<Pannel>
			{isParsing && <Loader fixed full />}
			{hasParsingError && <ErrorAlert />}
			<DropZoneIdle />
			<Dropzone.FullScreen accept={['text/plain', 'text/csv']} active={!isParsing} loading={isParsing} onDrop={handleAcceptedFilesDrop} onReject={handleRejectedFilesDrop} openRef={openFileBrowserRef}>
				<DropZoneAccept />
				<DropZoneReject />
			</Dropzone.FullScreen>
		</Pannel>
	);
}
